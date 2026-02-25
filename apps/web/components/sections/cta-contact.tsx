import Link from "next/link";

export function CtaContact() {
  return (
    <div className="rounded-3xl border p-6 sm:p-8">
      <h3 className="text-xl font-semibold tracking-tight">Bạn muốn trao đổi về dự án?</h3>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
        Mình ưu tiên trao đổi rõ mục tiêu, phạm vi, và đầu ra. Nếu phù hợp, có thể bắt đầu từ một
        bản kế hoạch triển khai ngắn.
      </p>
      <div className="mt-5">
        <Link
          className="inline-flex h-10 items-center justify-center rounded-xl border px-4 text-sm font-medium hover:bg-muted"
          href="/contact"
        >
          Đi tới Contact
        </Link>
      </div>
    </div>
  );
}
