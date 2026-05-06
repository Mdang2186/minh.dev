import { NextResponse } from "next/server";
import { prisma } from "@minh-dev/database";
import { jsonError, requireAdminResponse, writeAuditLog } from "@/lib/admin/api";
import { profileSchema, zodErrorMessage } from "@/lib/admin/validators";

async function getProfile() {
  return prisma.siteProfile.findFirst({ orderBy: { updatedAt: "desc" } });
}

export async function GET() {
  const { response } = await requireAdminResponse();
  if (response) return response;

  return NextResponse.json({ profile: await getProfile() });
}

export async function PUT(request: Request) {
  const { response } = await requireAdminResponse();
  if (response) return response;

  const parsed = profileSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return jsonError(zodErrorMessage(parsed.error));

  const existing = await getProfile();
  const profile = existing
    ? await prisma.siteProfile.update({ where: { id: existing.id }, data: parsed.data })
    : await prisma.siteProfile.create({ data: parsed.data });

  await writeAuditLog({
    action: "UPDATE",
    entity: "SiteProfile",
    entityId: profile.id,
    message: "Updated portfolio profile.",
  });

  return NextResponse.json({ profile });
}
