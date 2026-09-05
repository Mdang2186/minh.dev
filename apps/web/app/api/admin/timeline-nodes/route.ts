import { NextResponse } from "next/server";
import { prisma } from "@minh-dev/database";
import { jsonError, requireAdminResponse, writeAuditLog } from "@/lib/admin/api";
import { serializeAdminTimelineNode } from "@/lib/admin/serializers";
import { timelineNodeSchema, zodErrorMessage } from "@/lib/admin/validators";

const nodeInclude = {
  sprints: { orderBy: { sortOrder: "asc" as const } },
};

export async function GET() {
  const { response } = await requireAdminResponse();
  if (response) return response;

  const nodes = await prisma.timelineNode.findMany({
    orderBy: [{ date: "desc" }, { sortOrder: "asc" }],
    include: nodeInclude,
  });

  return NextResponse.json({ nodes: nodes.map(serializeAdminTimelineNode) });
}

export async function POST(request: Request) {
  const { response } = await requireAdminResponse();
  if (response) return response;

  const parsed = timelineNodeSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return jsonError(zodErrorMessage(parsed.error));

  const { sprints, ...data } = parsed.data;

  try {
    const node = await prisma.timelineNode.create({
      data: {
        ...data,
        sprints: {
          create: sprints.map((s, index) => ({ ...s, sortOrder: index })),
        },
      },
      include: nodeInclude,
    });

    await writeAuditLog({
      action: "CREATE",
      entity: "TimelineNode",
      entityId: node.id,
      message: `Created timeline node ${node.title}.`,
    });

    return NextResponse.json({ node: serializeAdminTimelineNode(node) }, { status: 201 });
  } catch (error) {
    console.error("Failed to create timeline node", error);
    return jsonError("Lỗi hệ thống khi tạo timeline node");
  }
}
