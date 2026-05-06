import { NextResponse } from "next/server";
import { prisma } from "@minh-dev/database";
import { jsonError, requireAdminResponse, writeAuditLog } from "@/lib/admin/api";
import { serializeAdminProject } from "@/lib/admin/serializers";
import { projectSchema, zodErrorMessage } from "@/lib/admin/validators";

const projectInclude = {
  images: { orderBy: { sortOrder: "asc" as const } },
  techStacks: { include: { techStack: true } },
};

type RouteContext = {
  params: Promise<{ id: string }>;
};

async function findOrCreateTechStacks(names: string[]) {
  const uniqueNames = Array.from(new Set(names.map((name) => name.trim()).filter(Boolean)));
  return Promise.all(
    uniqueNames.map((name) =>
      prisma.techStack.upsert({
        where: { name },
        update: {},
        create: { name },
      })
    )
  );
}

export async function GET(_request: Request, context: RouteContext) {
  const { response } = await requireAdminResponse();
  if (response) return response;

  const { id } = await context.params;
  const project = await prisma.project.findUnique({ where: { id }, include: projectInclude });
  if (!project) return jsonError("Không tìm thấy dự án.", 404);

  return NextResponse.json({ project: serializeAdminProject(project) });
}

export async function PUT(request: Request, context: RouteContext) {
  const { response } = await requireAdminResponse();
  if (response) return response;

  const { id } = await context.params;
  const parsed = projectSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return jsonError(zodErrorMessage(parsed.error));

  const existing = await prisma.project.findUnique({ where: { id } });
  if (!existing) return jsonError("Không tìm thấy dự án.", 404);

  const { techStacks, projectImages, ...data } = parsed.data;
  const techStackRows = await findOrCreateTechStacks(techStacks);

  try {
    const project = await prisma.$transaction(async (tx) => {
      await tx.projectImage.deleteMany({ where: { projectId: id } });
      await tx.projectTechStack.deleteMany({ where: { projectId: id } });
      return tx.project.update({
        where: { id },
        data: {
          ...data,
          images: {
            create: projectImages.map((image) => ({
              imageUrl: image.imageUrl,
              altText: image.altText,
              sortOrder: image.sortOrder,
            })),
          },
          techStacks: {
            create: techStackRows.map((techStack) => ({
              techStack: { connect: { id: techStack.id } },
            })),
          },
        },
        include: projectInclude,
      });
    });

    await writeAuditLog({
      action: "UPDATE",
      entity: "Project",
      entityId: project.id,
      message: `Updated project ${project.title}.`,
    });

    return NextResponse.json({ project: serializeAdminProject(project) });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return jsonError("Slug đã tồn tại.", 409);
    }
    throw error;
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
