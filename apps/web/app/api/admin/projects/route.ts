import { NextResponse } from "next/server";
import { prisma } from "@minh-dev/database";
import { jsonError, requireAdminResponse, writeAuditLog } from "@/lib/admin/api";
import {
  buildProjectImageCreates,
  buildProjectTechStackCreates,
  projectWriteErrorResponse,
  withDbRetry,
} from "@/lib/admin/project-write";
import { serializeAdminProject } from "@/lib/admin/serializers";
import { projectSchema, zodErrorMessage } from "@/lib/admin/validators";

const projectInclude = {
  images: { orderBy: { sortOrder: "asc" as const } },
  techStacks: { include: { techStack: true } },
};

export async function GET() {
  const { response } = await requireAdminResponse();
  if (response && process.env.NODE_ENV === "production") return response;

  const projects = await prisma.project.findMany({
    orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
    include: projectInclude,
  });

  return NextResponse.json({ projects: projects.map(serializeAdminProject) });
}

export async function POST(request: Request) {
  const { response } = await requireAdminResponse();
  if (response && process.env.NODE_ENV === "production") return response;

  const parsed = projectSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return jsonError(zodErrorMessage(parsed.error));

  const { techStacks, projectImages, showcaseImages, ...data } = parsed.data;

  try {
    const project = await withDbRetry(async () => {
      return prisma.project.create({
        data: {
          ...data,
          images: {
            create: buildProjectImageCreates(projectImages || []),
          },
          techStacks: {
            create: buildProjectTechStackCreates(techStacks || []),
          },
        },
        include: projectInclude,
      });
    });

    const cleanShowcase = (showcaseImages || []).map((s) => s.trim()).filter(Boolean);
    if (cleanShowcase.length > 0) {
      await withDbRetry(async () => {
        return prisma.$executeRawUnsafe(
          `UPDATE "Project" SET "showcaseImages" = $1 WHERE "id" = $2`,
          cleanShowcase,
          project.id
        );
      });
      (project as any).showcaseImages = cleanShowcase;
    }

    await writeAuditLog({
      action: "CREATE",
      entity: "Project",
      entityId: project.id,
      message: `Created project ${project.title}.`,
    });

    return NextResponse.json({ project: serializeAdminProject(project) }, { status: 201 });
  } catch (error) {
    console.error("PRISMA CREATE PROJECT ERROR", error);
    const res = projectWriteErrorResponse(error);
    if (res) return res;
    
    const message = error instanceof Error ? error.message : "Lỗi hệ thống khi tạo dự án. Vui lòng thử lại.";
    return jsonError(process.env.NODE_ENV === "development" ? message : "Lỗi hệ thống khi tạo dự án. Vui lòng thử lại.", 500);
  }
}
