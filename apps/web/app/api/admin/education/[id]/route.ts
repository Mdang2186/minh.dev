import { NextResponse } from "next/server";
import { prisma } from "@minh-dev/database";
import { jsonError, requireAdminResponse, writeAuditLog } from "@/lib/admin/api";
import { educationSchema, zodErrorMessage } from "@/lib/admin/validators";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, context: RouteContext) {
  const { response } = await requireAdminResponse();
  if (response) return response;

  const { id } = await context.params;
  const parsed = educationSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return jsonError(zodErrorMessage(parsed.error));

  try {
    const education = await prisma.education.update({
      where: { id },
      data: parsed.data,
    });
    
    await writeAuditLog({
      action: "UPDATE",
      entity: "Education",
      entityId: education.id,
      message: `Updated education ${education.title}.`,
    });

    return NextResponse.json({ education });
  } catch (error) {
    return jsonError("Không tìm thấy học vấn");
  }
}

export async function DELETE(_: Request, context: RouteContext) {
  const { response } = await requireAdminResponse();
  if (response) return response;

  try {
    const { id } = await context.params;
    await prisma.education.delete({ where: { id } });
    
    await writeAuditLog({
      action: "DELETE",
      entity: "Education",
      entityId: id,
      message: `Deleted education ${id}.`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return jsonError("Không thể xóa học vấn");
  }
}
