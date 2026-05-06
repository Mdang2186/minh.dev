import { NextResponse } from "next/server";
import { prisma } from "@minh-dev/database";
import { jsonError, requireAdminResponse, writeAuditLog } from "@/lib/admin/api";
import { skillSchema, zodErrorMessage } from "@/lib/admin/validators";

export async function POST(request: Request) {
  const { response } = await requireAdminResponse();
  if (response) return response;

  const parsed = skillSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return jsonError(zodErrorMessage(parsed.error));

  const skill = await prisma.skill.create({ data: parsed.data });
  await writeAuditLog({
    action: "CREATE",
    entity: "Skill",
    entityId: skill.id,
    message: `Created skill ${skill.name}.`,
  });

  return NextResponse.json({ skill }, { status: 201 });
}
