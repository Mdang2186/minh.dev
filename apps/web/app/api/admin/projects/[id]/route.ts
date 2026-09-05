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

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const project = await prisma.project.findUnique({ where: { id }, include: projectInclude });
    if (!project) return jsonError("Không tìm thấy dự án.", 404);

    if (!(project as any).showcaseImages || (project as any).showcaseImages.length === 0) {
      try {
        const rawRows = await prisma.$queryRawUnsafe<Array<{ showcaseImages: string[] }>>(
          `SELECT "showcaseImages" FROM "Project" WHERE "id" = $1 LIMIT 1`,
          id
        );
        if (rawRows?.[0]?.showcaseImages) {
          (project as any).showcaseImages = rawRows[0].showcaseImages;
        }
      } catch (err) {
        console.warn("Could not query raw showcaseImages", err);
      }
    }

    return NextResponse.json({ project: serializeAdminProject(project) });
  } catch (error) {
    console.error("GET PROJECT ERROR", error);
    return jsonError("Lỗi hệ thống khi tải dự án. Vui lòng tải lại trang.", 500);
  }
}

export async function PUT(request: Request, context: RouteContext) {
  const { response } = await requireAdminResponse();
  if (response && process.env.NODE_ENV === "production") return response;

  const { id } = await context.params;
  const parsed = projectSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    console.error("ZOD VALIDATION ERROR", parsed.error.issues);
    return jsonError(zodErrorMessage(parsed.error));
  }

  try {
    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) return jsonError("Không tìm thấy dự án.", 404);

    const { techStacks, projectImages, showcaseImages, ...data } = parsed.data;

    const updateData: any = { ...data };

    if (projectImages !== undefined) {
      updateData.images = {
        deleteMany: {},
        create: buildProjectImageCreates(projectImages),
      };
    }

    if (techStacks !== undefined) {
      updateData.techStacks = {
        deleteMany: {},
        create: buildProjectTechStackCreates(techStacks),
      };
    }

    const cleanShowcase = showcaseImages !== undefined 
      ? showcaseImages.map((s) => s.trim()).filter(Boolean)
      : undefined;

    // Use withDbRetry to protect against transient connection drops from Neon Serverless
    const project = await withDbRetry(async () => {
      return prisma.project.update({
        where: { id },
        data: updateData,
        include: projectInclude,
      });
    });

    if (cleanShowcase !== undefined) {
      // Also ensure raw column is synced in case Prisma client caching
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
      action: "UPDATE",
      entity: "Project",
      entityId: project.id,
      message: `Updated project ${project.title}.`,
    });

    return NextResponse.json({ project: serializeAdminProject(project) });
  } catch (error) {
    console.error("PRISMA SAVE ERROR", error);
    const errRes = projectWriteErrorResponse(error);
    if (errRes) return errRes;
    
    const message = error instanceof Error ? error.message : "Lỗi hệ thống khi lưu dự án. Vui lòng thử lại.";
    return jsonError(process.env.NODE_ENV === "development" ? message : "Lỗi hệ thống khi lưu dự án. Vui lòng thử lại.", 500);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { response } = await requireAdminResponse();
  if (response) return response;

  const { id } = await context.params;
  const existing = await prisma.project.findUnique({ where: { id } });
  if (!existing) return jsonError("Không tìm thấy dự án.", 404);

  await prisma.project.delete({ where: { id } });
  await writeAuditLog({
    action: "DELETE",
    entity: "Project",
    entityId: id,
    message: `Deleted project ${existing.title}.`,
  });

  return NextResponse.json({ ok: true });
}
