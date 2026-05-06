import { NextResponse } from "next/server";
import { prisma } from "@minh-dev/database";
import { jsonError, requireAdminResponse, writeAuditLog } from "@/lib/admin/api";
import { socialLinkSchema, zodErrorMessage } from "@/lib/admin/validators";

export async function GET() {
  const { response } = await requireAdminResponse();
  if (response) return response;

  const socialLinks = await prisma.socialLink.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });

  return NextResponse.json({ socialLinks });
}

export async function POST(request: Request) {
  const { response } = await requireAdminResponse();
  if (response) return response;

  const parsed = socialLinkSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return jsonError(zodErrorMessage(parsed.error));

  const socialLink = await prisma.socialLink.create({ data: parsed.data });
  await writeAuditLog({
    action: "CREATE",
    entity: "SocialLink",
    entityId: socialLink.id,
    message: `Created social link ${socialLink.name}.`,
  });

  return NextResponse.json({ socialLink }, { status: 201 });
}
