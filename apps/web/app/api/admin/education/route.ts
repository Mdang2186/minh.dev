import { NextResponse } from "next/server";
import { prisma } from "@minh-dev/database";
import { jsonError, requireAdminResponse, writeAuditLog } from "@/lib/admin/api";
import { educationSchema, zodErrorMessage } from "@/lib/admin/validators";

export async function GET() {
  const { response } = await requireAdminResponse();
  if (response) return response;

  const educations = await prisma.education.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });

  return NextResponse.json({ educations });
}

export async function POST(request: Request) {
  const { response } = await requireAdminResponse();
  if (response) return response;

  const parsed = educationSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return jsonError(zodErrorMessage(parsed.error));

  const education = await prisma.education.create({ data: parsed.data });
  await writeAuditLog({
    action: "CREATE",
    entity: "Education",
    entityId: education.id,
    message: `Created education ${education.title}.`,
  });

  return NextResponse.json({ education }, { status: 201 });
}
