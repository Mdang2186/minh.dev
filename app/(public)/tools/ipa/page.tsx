"use client";

import { useMemo, useState } from "react";
import { Container } from "@/components/common/container";
import { PageHeader } from "@/components/common/page-header";

function toPseudoIPA(input: string) {
  // Demo giả lập (không phải IPA chuẩn). Bạn thay logic sau.
  return input
    .trim()
    .replaceAll("th", "tʰ")
    .replaceAll("ng", "ŋ")
    .replaceAll("ch", "tɕ")
    .replaceAll("nh", "ɲ")
    .replaceAll("ph", "f")
    .replaceAll("tr", "ʈ")
    .replaceAll("kh", "x");
}

export default function IpaToolPage() {
  const [text, setText] = useState("xin chào thế giới");
  const out = useMemo(() => (text ? toPseudoIPA(text.toLowerCase()) : ""), [text]);

  return (
    <Container className="py-10">
      <PageHeader
        title="IPA Helper"
        description="Demo công cụ nhỏ. Hiện dùng chuyển đổi giả lập để có khung UI."
      />

      <div className="mt-6 grid gap-4">
        <div className="rounded-2xl border p-5">
          <label className="text-sm font-medium">Input</label>
          <textarea
            className="mt-2 w-full rounded-xl border bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            rows={4}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Nhập câu..."
          />
        </div>

        <div className="rounded-2xl border p-5">
          <div className="flex items-center justify-between gap-4">
            <label className="text-sm font-medium">Output</label>
            <button
              className="h-9 rounded-xl border px-3 text-sm font-medium hover:bg-muted"
              onClick={() => navigator.clipboard.writeText(out)}
            >
              Copy
            </button>
          </div>
          <pre className="mt-2 whitespace-pre-wrap rounded-xl bg-muted p-3 text-sm">{out || "—"}</pre>
        </div>
      </div>
    </Container>
  );
}
