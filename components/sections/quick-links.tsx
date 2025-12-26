import Link from "next/link";

const items = [
  { href: "/projects", title: "Projects", desc: "Danh sách dự án, mô tả + stack + link demo/repo." },
  { href: "/blog", title: "Blog", desc: "Bài viết ngắn gọn về kỹ thuật và trải nghiệm." },
  { href: "/work/experience", title: "Experience", desc: "Kinh nghiệm theo thời gian, ưu tiên kết quả." },
  { href: "/work/skills-and-tools", title: "Skills & Tools", desc: "Kỹ năng và công cụ thường dùng." },
];

export function QuickLinks() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {items.map((i) => (
        <Link key={i.href} href={i.href} className="rounded-2xl border p-5 hover:bg-muted">
          <div className="text-base font-semibold">{i.title}</div>
          <p className="mt-2 text-sm text-muted-foreground">{i.desc}</p>
        </Link>
      ))}
    </div>
  );
}
