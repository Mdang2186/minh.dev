"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/common/container";
import { PageHeader } from "@/components/common/page-header";

function pad2(n: number) {
  return n.toString().padStart(2, "0");
}

export default function ClockPage() {
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const hh = pad2(now.getHours());
  const mm = pad2(now.getMinutes());
  const ss = pad2(now.getSeconds());

  return (
    <Container className="py-10">
      <PageHeader title="Clock" description="Ví dụ trang client-side realtime." />
      <div className="mt-6 rounded-2xl border p-8 text-center">
        <div className="text-5xl font-semibold tracking-tight tabular-nums">
          {hh}:{mm}:{ss}
        </div>
        <p className="mt-3 text-sm text-muted-foreground">Cập nhật mỗi giây.</p>
      </div>
    </Container>
  );
}
