import { NextResponse } from "next/server";
import { prisma } from "@minh-dev/database";
import { jsonError, requireAdminResponse, writeAuditLog } from "@/lib/admin/api";
import { certificationSchema, zodErrorMessage } from "@/lib/admin/validators";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, context: RouteContext) {
  const { response } = await requireAdminResponse();
  if (response) return response;

  const { id } = await context.params;
  const parsed = certificationSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return jsonError(zodErrorMessage(parsed.error));

  try {
    const certification = await (prisma as any).certification.update({
      where: { id },
      data: parsed.data,
    });
    
    await writeAuditLog({
      action: "UPDATE",
      entity: "Certification",
      entityId: certification.id,
      message: `Updated certification ${certification.title}.`,
    });

    return NextResponse.json({ certification });
  } catch (error) {
    return jsonError("Không tìm thấy chứng chỉ");
  }
}

export async function DELETE(_: Request, context: RouteContext) {
  const { response } = await requireAdminResponse();
  if (response) return response;

  try {
    const { id } = await context.params;
    await (prisma as any).certification.delete({ where: { id } });
    
    await writeAuditLog({
      action: "DELETE",
      entity: "Certification",
      entityId: id,
      message: `Deleted certification ${id}.`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return jsonError("Không thể xóa chứng chỉ");
  }
}
