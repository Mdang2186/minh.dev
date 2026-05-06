import { NextResponse } from "next/server";
import { prisma } from "@minh-dev/database";
import { jsonError, requireAdminResponse, writeAuditLog } from "@/lib/admin/api";
import { skillGroupSchema, zodErrorMessage } from "@/lib/admin/validators";

type RouteContext = {
  params: Promise<{ id: string }>;
};

const includeSkills = {
  skills: { orderBy: { sortOrder: "asc" as const } },
};

export async function PUT(request: Request, context: RouteContext) {
  const { response } = await requireAdminResponse();
  if (response) return response;

  const { id } = await context.params;
  const parsed = skillGroupSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return jsonError(zodErrorMessage(parsed.error));

  const group = await prisma.skillGroup.update({
    where: { id },
    data: parsed.data,
    include: includeSkills,
  });
  await writeAuditLog({
    action: "UPDATE",
    entity: "SkillGroup",
    entityId: group.id,
    message: `Updated skill group ${group.title}.`,
  });

  return NextResponse.json({ group });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { response } = await requireAdminResponse();
  if (response) return response;

  const { id } = await context.params;
  await prisma.skillGroup.delete({ where: { id } });
  await writeAuditLog({
    action: "DELETE",
    entity: "SkillGroup",
    entityId: id,
    message: "Deleted skill group.",
  });

  return NextResponse.json({ ok: true });
}
