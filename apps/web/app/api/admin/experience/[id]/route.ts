import { NextResponse } from "next/server";
import { prisma } from "@minh-dev/database";
import { jsonError, requireAdminResponse, writeAuditLog } from "@/lib/admin/api";
import { experienceSchema, zodErrorMessage } from "@/lib/admin/validators";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, context: RouteContext) {
  const { response } = await requireAdminResponse();
  if (response) return response;

  const { id } = await context.params;
  const parsed = experienceSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return jsonError(zodErrorMessage(parsed.error));

  const experience = await prisma.experience.update({ where: { id }, data: parsed.data });
  await writeAuditLog({
    action: "UPDATE",
    entity: "Experience",
    entityId: experience.id,
    message: `Updated experience ${experience.title}.`,
  });

  return NextResponse.json({ experience });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { response } = await requireAdminResponse();
  if (response) return response;

  const { id } = await context.params;
  await prisma.experience.delete({ where: { id } });
  await writeAuditLog({
    action: "DELETE",
    entity: "Experience",
    entityId: id,
    message: "Deleted experience.",
  });

  return NextResponse.json({ ok: true });
}
