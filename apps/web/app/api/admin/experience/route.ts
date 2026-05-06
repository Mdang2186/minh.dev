import { NextResponse } from "next/server";
import { prisma } from "@minh-dev/database";
import { jsonError, requireAdminResponse, writeAuditLog } from "@/lib/admin/api";
import { experienceSchema, zodErrorMessage } from "@/lib/admin/validators";

export async function GET() {
  const { response } = await requireAdminResponse();
  if (response) return response;

  const experiences = await prisma.experience.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });

  return NextResponse.json({ experiences });
}

export async function POST(request: Request) {
  const { response } = await requireAdminResponse();
  if (response) return response;

  const parsed = experienceSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return jsonError(zodErrorMessage(parsed.error));

  const experience = await prisma.experience.create({ data: parsed.data });
  await writeAuditLog({
    action: "CREATE",
    entity: "Experience",
    entityId: experience.id,
    message: `Created experience ${experience.title}.`,
  });

  return NextResponse.json({ experience }, { status: 201 });
}
