import { NextResponse } from "next/server";
import { prisma } from "@minh-dev/database";
import { jsonError, requireAdminResponse, writeAuditLog } from "@/lib/admin/api";

export async function POST(request: Request) {
  const { response } = await requireAdminResponse();
  if (response) return response;

  try {
    const { order } = await request.json();
    
    if (!Array.isArray(order)) {
      return jsonError("Dữ liệu không hợp lệ");
    }

    // Update in a transaction
    await prisma.$transaction(
      order.map((item: { id: string; sortOrder: number }) =>
        prisma.timelineNode.update({
          where: { id: item.id },
          data: { sortOrder: item.sortOrder },
        })
      )
    );

    await writeAuditLog({
      action: "REORDER",
      entity: "TimelineNode",
      entityId: "batch",
      message: `Reordered timeline nodes`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to reorder timeline nodes", error);
    return jsonError("Lỗi hệ thống khi sắp xếp");
  }
}
