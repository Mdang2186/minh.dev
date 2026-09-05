import { NextResponse } from "next/server";
import { prisma } from "@minh-dev/database";
import { jsonError, requireAdminResponse, writeAuditLog } from "@/lib/admin/api";
import { certificationSchema, zodErrorMessage } from "@/lib/admin/validators";

export async function GET() {
  const { response } = await requireAdminResponse();
  if (response) return response;

  const certifications = await (prisma as any).certification.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });

  return NextResponse.json({ certifications });
}

export async function POST(request: Request) {
  const { response } = await requireAdminResponse();
  if (response) return response;

  const parsed = certificationSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return jsonError(zodErrorMessage(parsed.error));

  const certification = await (prisma as any).certification.create({ data: parsed.data });
  await writeAuditLog({
    action: "CREATE",
    entity: "Certification",
    entityId: certification.id,
    message: `Created certification ${certification.title}.`,
  });

  return NextResponse.json({ certification }, { status: 201 });
}
