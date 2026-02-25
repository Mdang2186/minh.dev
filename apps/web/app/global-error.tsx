"use client";

import { useEffect } from "react";
import { Container } from "@/components/common/container";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <html lang="vi">
      <body className="min-h-dvh bg-background text-foreground antialiased">
        <Container className="py-16">
          <h1 className="text-3xl font-semibold tracking-tight">Có lỗi xảy ra</h1>
          <p className="mt-3 text-muted-foreground">
            Bạn có thể thử tải lại. Nếu vẫn lỗi, hãy kiểm tra log console.
          </p>
          <button
            className="mt-6 inline-flex h-10 items-center justify-center rounded-xl border px-4 text-sm font-medium hover:bg-muted"
            onClick={reset}
          >
            Thử lại
          </button>
        </Container>
      </body>
    </html>
  );
}
