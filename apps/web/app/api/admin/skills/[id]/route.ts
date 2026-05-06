import { NextResponse } from "next/server";
import { prisma } from "@minh-dev/database";
import { jsonError, requireAdminResponse, writeAuditLog } from "@/lib/admin/api";
import { skillSchema, zodErrorMessage } from "@/lib/admin/validators";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, context: RouteContext) {
  const { response } = await requireAdminResponse();
  if (response) return response;

  const { id } = await context.params;
  const parsed = skillSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return jsonError(zodErrorMessage(parsed.error));

  const skill = await prisma.skill.update({ where: { id }, data: parsed.data });
  await writeAuditLog({
    action: "UPDATE",
    entity: "Skill",
    entityId: skill.id,
    message: `Updated skill ${skill.name}.`,
  });

  return NextResponse.json({ skill });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { response } = await requireAdminResponse();
  if (response) return response;

  const { id } = await context.params;
  await prisma.skill.delete({ where: { id } });
  await writeAuditLog({
    action: "DELETE",
    entity: "Skill",
    entityId: id,
    message: "Deleted skill.",
  });

  return NextResponse.json({ ok: true });
}
