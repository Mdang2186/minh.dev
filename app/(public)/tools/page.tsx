import Link from "next/link";
import { Container } from "@/components/common/container";
import { PageHeader } from "@/components/common/page-header";

const tools = [
  { href: "/tools/ipa", name: "IPA Helper", desc: "Trang tool mẫu: input → output." },
  { href: "/tools/clock", name: "Clock", desc: "Đồng hồ realtime (client-side)." },
];

export default function ToolsPage() {
  return (
    <Container className="py-10">
      <PageHeader title="Tools" description="Các mini tools theo phong cách gọn." />
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {tools.map((t) => (
          <Link key={t.href} href={t.href} className="rounded-2xl border p-5 hover:bg-muted">
            <div className="text-base font-semibold">{t.name}</div>
            <p className="mt-2 text-sm text-muted-foreground">{t.desc}</p>
          </Link>
        ))}
      </div>
    </Container>
  );
}
