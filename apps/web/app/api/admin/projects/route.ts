import { NextResponse } from "next/server";
import { prisma } from "@minh-dev/database";
import { jsonError, requireAdminResponse, writeAuditLog } from "@/lib/admin/api";
import { serializeAdminProject } from "@/lib/admin/serializers";
import { projectSchema, zodErrorMessage } from "@/lib/admin/validators";

const projectInclude = {
  images: { orderBy: { sortOrder: "asc" as const } },
  techStacks: { include: { techStack: true } },
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
  const techStackRows = await findOrCreateTechStacks(techStacks);

  try {
    const project = await prisma.project.create({
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

    await writeAuditLog({
      action: "CREATE",
      entity: "Project",
      entityId: project.id,
      message: `Created project ${project.title}.`,
    });

    return NextResponse.json({ project: serializeAdminProject(project) }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return jsonError("Slug đã tồn tại.", 409);
    }
    throw error;
  }
}
