import { NextResponse } from "next/server";
import { prisma } from "@minh-dev/database";
import { jsonError, requireAdminResponse, writeAuditLog } from "@/lib/admin/api";
import { socialLinkSchema, zodErrorMessage } from "@/lib/admin/validators";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, context: RouteContext) {
  const { response } = await requireAdminResponse();
  if (response) return response;

  const { id } = await context.params;
  const parsed = socialLinkSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return jsonError(zodErrorMessage(parsed.error));

  const socialLink = await prisma.socialLink.update({ where: { id }, data: parsed.data });
  await writeAuditLog({
    action: "UPDATE",
    entity: "SocialLink",
    entityId: socialLink.id,
    message: `Updated social link ${socialLink.name}.`,
  });

  return NextResponse.json({ socialLink });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { response } = await requireAdminResponse();
  if (response) return response;

  const { id } = await context.params;
  await prisma.socialLink.delete({ where: { id } });
  await writeAuditLog({
    action: "DELETE",
    entity: "SocialLink",
    entityId: id,
    message: "Deleted social link.",
  });

  return NextResponse.json({ ok: true });
}
