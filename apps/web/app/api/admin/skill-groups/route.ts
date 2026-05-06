import { NextResponse } from "next/server";
import { prisma } from "@minh-dev/database";
import { jsonError, requireAdminResponse, writeAuditLog } from "@/lib/admin/api";
import { skillGroupSchema, zodErrorMessage } from "@/lib/admin/validators";

const includeSkills = {
  skills: { orderBy: { sortOrder: "asc" as const } },
};

export async function GET() {
  const { response } = await requireAdminResponse();
  if (response) return response;

  const groups = await prisma.skillGroup.findMany({
    orderBy: { sortOrder: "asc" },
    include: includeSkills,
  });

  return NextResponse.json({ groups });
}

export async function POST(request: Request) {
  const { response } = await requireAdminResponse();
  if (response) return response;

  const parsed = skillGroupSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return jsonError(zodErrorMessage(parsed.error));

  const group = await prisma.skillGroup.create({ data: parsed.data, include: includeSkills });
  await writeAuditLog({
    action: "CREATE",
    entity: "SkillGroup",
    entityId: group.id,
    message: `Created skill group ${group.title}.`,
  });

  return NextResponse.json({ group }, { status: 201 });
}
