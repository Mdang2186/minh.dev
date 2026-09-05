import { NextResponse } from "next/server";
import { prisma } from "@minh-dev/database";
import { jsonError, requireAdminResponse, writeAuditLog } from "@/lib/admin/api";
import { serializeAdminTimelineNode } from "@/lib/admin/serializers";
import { timelineNodeSchema, zodErrorMessage } from "@/lib/admin/validators";

const nodeInclude = {
  sprints: { orderBy: { sortOrder: "asc" as const } },
};

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const { response } = await requireAdminResponse();
  if (response) return response;

  const { id } = await context.params;

  const node = await prisma.timelineNode.findUnique({
    where: { id },
    include: nodeInclude,
  });

  if (!node) return jsonError("Không tìm thấy timeline node", 404);
  return NextResponse.json({ node: serializeAdminTimelineNode(node) });
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  const { response } = await requireAdminResponse();
  if (response) return response;

  const { id } = await context.params;
  const parsed = timelineNodeSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return jsonError(zodErrorMessage(parsed.error));

  const { sprints, ...data } = parsed.data;

  try {
    const node = await prisma.timelineNode.update({
      where: { id },
      data: {
        ...data,
        sprints: {
          deleteMany: {},
          create: sprints.map((s, index) => ({ ...s, sortOrder: index })),
        },
      },
      include: nodeInclude,
    });

    await writeAuditLog({
      action: "UPDATE",
      entity: "TimelineNode",
      entityId: node.id,
      message: `Updated timeline node ${node.title}.`,
    });

    return NextResponse.json({ node: serializeAdminTimelineNode(node) });
  } catch (error) {
    console.error("Failed to update timeline node", error);
    return jsonError("Lỗi hệ thống khi cập nhật timeline node");
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  const { response } = await requireAdminResponse();
  if (response) return response;

  const { id } = await context.params;

  try {
    const node = await prisma.timelineNode.delete({
      where: { id },
    });

    await writeAuditLog({
      action: "DELETE",
      entity: "TimelineNode",
      entityId: node.id,
      message: `Deleted timeline node ${node.title}.`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete timeline node", error);
    return jsonError("Lỗi hệ thống khi xóa timeline node");
  }
}
