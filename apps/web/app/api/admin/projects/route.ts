import { NextResponse } from "next/server";
import { prisma } from "@minh-dev/database";
import { jsonError, requireAdminResponse, writeAuditLog } from "@/lib/admin/api";
import { buildProjectImageCreates, buildProjectTechStackCreates, projectWriteErrorResponse } from "@/lib/admin/project-write";
import { serializeAdminProject } from "@/lib/admin/serializers";
import { projectSchema, zodErrorMessage } from "@/lib/admin/validators";

const projectInclude = {
  images: { orderBy: { sortOrder: "asc" as const } },
  techStacks: { include: { techStack: true } },
};

export async function GET() {
  const { response } = await requireAdminResponse();
  if (response) return response;

  const projects = await prisma.project.findMany({
    orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
    include: projectInclude,
  });

  return NextResponse.json({ projects: projects.map(serializeAdminProject) });
}

export async function POST(request: Request) {
  const { response } = await requireAdminResponse();
  if (response) return response;

  const parsed = projectSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return jsonError(zodErrorMessage(parsed.error));

  const { techStacks, projectImages, ...data } = parsed.data;

  try {
    const project = await prisma.project.create({
      data: {
        ...data,
        images: {
          create: buildProjectImageCreates(projectImages),
        },
        techStacks: {
          create: buildProjectTechStackCreates(techStacks),
        },
      },
      include: projectInclude,
    });

    await writeAuditLog({
      action: "CREATE",
      entity: "Project",
      entityId: project.id,
      message: `Created project ${project.title}.`,
    });

    return NextResponse.json({ project: serializeAdminProject(project) }, { status: 201 });
  } catch (error) {
    const response = projectWriteErrorResponse(error);
    if (response) return response;
    throw error;
  }
}
