# scripts/scaffold-public.ps1
# Run:
#   Set-ExecutionPolicy -Scope Process Bypass
#   .\scripts\scaffold-public.ps1

$ErrorActionPreference = "Stop"

function Write-File {
  param(
    [Parameter(Mandatory=$true)][string]$Path,
    [Parameter(Mandatory=$true)][string]$Content
  )
  $dir = Split-Path -Parent $Path
  if (!(Test-Path $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }
  $Content | Out-File -FilePath $Path -Encoding UTF8
  Write-Host "Wrote: $Path"
}

# -----------------------------
# app layout + core routes
# -----------------------------
Write-File -Path "app/layout.tsx" -Content @'
import type { Metadata } from "next";
import "../styles/globals.css";
import { siteConfig } from "@/features/site/site.config";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.author.name, url: siteConfig.author.url }],
  creator: siteConfig.author.name,
  openGraph: {
    type: "website",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className="min-h-dvh bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
'@

Write-File -Path "app/not-found.tsx" -Content @'
import Link from "next/link";
import { Container } from "@/components/common/container";

export default function NotFound() {
  return (
    <Container className="py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Không tìm thấy trang</h1>
      <p className="mt-3 text-muted-foreground">
        Liên kết bạn mở không tồn tại hoặc đã được thay đổi.
      </p>
      <div className="mt-6">
        <Link className="text-sm font-medium underline underline-offset-4" href="/">
          Về trang chủ
        </Link>
      </div>
    </Container>
  );
}
'@

Write-File -Path "app/global-error.tsx" -Content @'
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
'@

Write-File -Path "app/robots.ts" -Content @'
import type { MetadataRoute } from "next";
import { siteConfig } from "@/features/site/site.config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
'@

Write-File -Path "app/sitemap.ts" -Content @'
import type { MetadataRoute } from "next";
import { siteConfig } from "@/features/site/site.config";
import { getAllPosts } from "@/features/blog/blog.service";
import { getAllProjects } from "@/features/projects/projects.service";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteConfig.url}/`, lastModified: now },
    { url: `${siteConfig.url}/projects`, lastModified: now },
    { url: `${siteConfig.url}/blog`, lastModified: now },
    { url: `${siteConfig.url}/work/experience`, lastModified: now },
    { url: `${siteConfig.url}/work/skills-and-tools`, lastModified: now },
    { url: `${siteConfig.url}/about`, lastModified: now },
    { url: `${siteConfig.url}/contact`, lastModified: now },
    { url: `${siteConfig.url}/tools`, lastModified: now },
    { url: `${siteConfig.url}/tools/ipa`, lastModified: now },
    { url: `${siteConfig.url}/tools/clock`, lastModified: now },
    { url: `${siteConfig.url}/search`, lastModified: now },
  ];

  const posts = getAllPosts().map((p) => ({
    url: `${siteConfig.url}/blog/${p.slug}`,
    lastModified: p.updatedAt ?? p.publishedAt ?? now,
  }));

  const projects = getAllProjects().map((p) => ({
    url: `${siteConfig.url}/projects/${p.slug}`,
    lastModified: p.updatedAt ?? now,
  }));

  return [...staticRoutes, ...posts, ...projects];
}
'@

# -----------------------------
# Public route-group
# -----------------------------
Write-File -Path "app/(public)/layout.tsx" -Content @'
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
'@

Write-File -Path "app/(public)/page.tsx" -Content @'
import Link from "next/link";
import { Container } from "@/components/common/container";
import { Hero } from "@/components/sections/hero";
import { QuickLinks } from "@/components/sections/quick-links";
import { FeaturedProjects } from "@/components/sections/featured-projects";
import { FeaturedPosts } from "@/components/sections/featured-posts";
import { ExperiencePreview } from "@/components/sections/experience-preview";
import { CtaContact } from "@/components/sections/cta-contact";

export default function HomePage() {
  return (
    <>
      <Container className="py-10">
        <Hero />
        <div className="mt-8">
          <QuickLinks />
        </div>

        <div className="mt-10 grid gap-10">
          <section>
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold tracking-tight">Dự án nổi bật</h2>
              <Link className="text-sm font-medium underline underline-offset-4" href="/projects">
                Xem tất cả
              </Link>
            </div>
            <div className="mt-4">
              <FeaturedProjects />
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold tracking-tight">Bài viết mới</h2>
              <Link className="text-sm font-medium underline underline-offset-4" href="/blog">
                Xem blog
              </Link>
            </div>
            <div className="mt-4">
              <FeaturedPosts />
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold tracking-tight">Kinh nghiệm</h2>
              <Link
                className="text-sm font-medium underline underline-offset-4"
                href="/work/experience"
              >
                Xem chi tiết
              </Link>
            </div>
            <div className="mt-4">
              <ExperiencePreview />
            </div>
          </section>

          <section>
            <CtaContact />
          </section>
        </div>
      </Container>
    </>
  );
}
'@

# Projects
Write-File -Path "app/(public)/projects/page.tsx" -Content @'
import { Container } from "@/components/common/container";
import { PageHeader } from "@/components/common/page-header";
import { ProjectCard } from "@/components/cards/project-card";
import { getAllProjects } from "@/features/projects/projects.service";

export default function ProjectsPage() {
  const projects = getAllProjects();

  return (
    <Container className="py-10">
      <PageHeader
        title="Projects"
        description="Tổng hợp dự án theo hướng gọn, rõ, dễ xem. Mỗi dự án có mô tả, stack và liên kết demo/repo."
      />
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {projects.map((p) => (
          <ProjectCard key={p.slug} project={p} />
        ))}
      </div>
    </Container>
  );
}
'@

Write-File -Path "app/(public)/projects/[slug]/loading.tsx" -Content @'
import { Container } from "@/components/common/container";

export default function LoadingProject() {
  return (
    <Container className="py-10">
      <div className="h-7 w-64 animate-pulse rounded bg-muted" />
      <div className="mt-3 h-4 w-96 animate-pulse rounded bg-muted" />
      <div className="mt-8 grid gap-3">
        <div className="h-4 w-full animate-pulse rounded bg-muted" />
        <div className="h-4 w-11/12 animate-pulse rounded bg-muted" />
        <div className="h-4 w-10/12 animate-pulse rounded bg-muted" />
      </div>
    </Container>
  );
}
'@

Write-File -Path "app/(public)/projects/[slug]/page.tsx" -Content @'
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/common/container";
import { TagPill } from "@/components/common/tag-pill";
import { getProjectBySlug } from "@/features/projects/projects.service";

export default function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const project = getProjectBySlug(params.slug);
  if (!project) return notFound();

  return (
    <Container className="py-10">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold tracking-tight">{project.name}</h1>
        <p className="text-muted-foreground">{project.summary}</p>

        <div className="flex flex-wrap gap-2">
          {project.stack.map((t) => (
            <TagPill key={t} label={t} href={`/tag/${encodeURIComponent(t)}`} />
          ))}
        </div>

        <div className="mt-2 flex flex-wrap gap-3 text-sm">
          {project.links.demo ? (
            <a className="underline underline-offset-4" href={project.links.demo} target="_blank">
              Demo
            </a>
          ) : null}
          {project.links.repo ? (
            <a className="underline underline-offset-4" href={project.links.repo} target="_blank">
              Repo
            </a>
          ) : null}
          <Link className="underline underline-offset-4" href="/projects">
            Quay lại Projects
          </Link>
        </div>
      </div>

      <article className="prose prose-neutral mt-10 max-w-none dark:prose-invert">
        {project.content.map((block, idx) => (
          <p key={idx}>{block}</p>
        ))}
      </article>
    </Container>
  );
}
'@

# Blog
Write-File -Path "app/(public)/blog/page.tsx" -Content @'
import { Container } from "@/components/common/container";
import { PageHeader } from "@/components/common/page-header";
import { PostCard } from "@/components/cards/post-card";
import { getAllPosts } from "@/features/blog/blog.service";

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <Container className="py-10">
      <PageHeader
        title="Blog"
        description="Ghi chép ngắn, rõ ràng về kỹ thuật, dự án và trải nghiệm triển khai."
      />

      <div className="mt-6 grid gap-4">
        {posts.map((p) => (
          <PostCard key={p.slug} post={p} />
        ))}
      </div>
    </Container>
  );
}
'@

Write-File -Path "app/(public)/blog/[slug]/loading.tsx" -Content @'
import { Container } from "@/components/common/container";

export default function LoadingPost() {
  return (
    <Container className="py-10">
      <div className="h-7 w-72 animate-pulse rounded bg-muted" />
      <div className="mt-3 h-4 w-96 animate-pulse rounded bg-muted" />
      <div className="mt-8 grid gap-3">
        <div className="h-4 w-full animate-pulse rounded bg-muted" />
        <div className="h-4 w-11/12 animate-pulse rounded bg-muted" />
        <div className="h-4 w-10/12 animate-pulse rounded bg-muted" />
      </div>
    </Container>
  );
}
'@

Write-File -Path "app/(public)/blog/[slug]/page.tsx" -Content @'
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/common/container";
import { TagPill } from "@/components/common/tag-pill";
import { formatDate } from "@/lib/date";
import { getPostBySlug } from "@/features/blog/blog.service";

export default function PostDetailPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  if (!post) return notFound();

  return (
    <Container className="py-10">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold tracking-tight">{post.title}</h1>
        <p className="text-muted-foreground">{post.description}</p>

        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span>{formatDate(post.publishedAt)}</span>
          <span>•</span>
          <span>{post.readingTimeMinutes} phút đọc</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {post.tags.map((t) => (
            <TagPill key={t} label={t} href={`/tag/${encodeURIComponent(t)}`} />
          ))}
        </div>

        <div className="mt-2 text-sm">
          <Link className="underline underline-offset-4" href="/blog">
            Quay lại Blog
          </Link>
        </div>
      </div>

      <article className="prose prose-neutral mt-10 max-w-none dark:prose-invert">
        {post.content.map((block, idx) => (
          <p key={idx}>{block}</p>
        ))}
      </article>
    </Container>
  );
}
'@

# Work
Write-File -Path "app/(public)/work/experience/page.tsx" -Content @'
import { Container } from "@/components/common/container";
import { PageHeader } from "@/components/common/page-header";
import { experiences } from "@/features/work/work.data";

export default function ExperiencePage() {
  return (
    <Container className="py-10">
      <PageHeader
        title="Experience"
        description="Tóm tắt kinh nghiệm học tập/làm việc theo thời gian, tập trung vào kết quả và vai trò."
      />

      <div className="mt-6 grid gap-4">
        {experiences.map((e) => (
          <div key={e.id} className="rounded-2xl border p-5">
            <div className="flex flex-col gap-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-base font-semibold">{e.title}</h3>
                <span className="text-sm text-muted-foreground">{e.period}</span>
              </div>
              <p className="text-sm text-muted-foreground">{e.org}</p>
            </div>

            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm">
              {e.highlights.map((h, idx) => (
                <li key={idx}>{h}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Container>
  );
}
'@

Write-File -Path "app/(public)/work/skills-and-tools/page.tsx" -Content @'
import { Container } from "@/components/common/container";
import { PageHeader } from "@/components/common/page-header";
import { skills, tools } from "@/features/work/work.data";
import { TagPill } from "@/components/common/tag-pill";

export default function SkillsToolsPage() {
  return (
    <Container className="py-10">
      <PageHeader
        title="Skills & Tools"
        description="Nhóm kỹ năng và công cụ theo mảng: backend, frontend, database, devops, testing."
      />

      <div className="mt-6 grid gap-6">
        <section className="rounded-2xl border p-5">
          <h3 className="text-base font-semibold">Skills</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {skills.map((s) => (
              <TagPill key={s} label={s} href={`/tag/${encodeURIComponent(s)}`} />
            ))}
          </div>
        </section>

        <section className="rounded-2xl border p-5">
          <h3 className="text-base font-semibold">Tools</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {tools.map((t) => (
              <TagPill key={t} label={t} href={`/tag/${encodeURIComponent(t)}`} />
            ))}
          </div>
        </section>
      </div>
    </Container>
  );
}
'@

# About + Contact
Write-File -Path "app/(public)/about/page.tsx" -Content @'
import { Container } from "@/components/common/container";
import { PageHeader } from "@/components/common/page-header";
import { siteConfig } from "@/features/site/site.config";

export default function AboutPage() {
  return (
    <Container className="py-10">
      <PageHeader
        title="About"
        description="Giới thiệu ngắn gọn, tập trung vào năng lực triển khai và các hướng bạn đang theo đuổi."
      />

      <div className="mt-6 rounded-2xl border p-5">
        <p className="text-sm leading-6 text-muted-foreground">
          Xin chào, mình là <span className="font-medium text-foreground">{siteConfig.author.name}</span>.
          Đây là website tổng hợp dự án, bài viết và công cụ nhỏ phục vụ học tập/làm việc.
          Mục tiêu là trình bày rõ ràng, dễ xem, ưu tiên nội dung hơn hiệu ứng.
        </p>

        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm">
          <li>Ưu tiên cấu trúc sạch: tách route / features / components.</li>
          <li>Viết nội dung theo hướng “ngắn, rõ, có kết quả”.</li>
          <li>Sẵn sàng mở rộng sang trang quản trị (admin) khi cần.</li>
        </ul>
      </div>
    </Container>
  );
}
'@

Write-File -Path "app/(public)/contact/page.tsx" -Content @'
import { Container } from "@/components/common/container";
import { PageHeader } from "@/components/common/page-header";
import { siteConfig } from "@/features/site/site.config";

export default function ContactPage() {
  return (
    <Container className="py-10">
      <PageHeader
        title="Contact"
        description="Kênh liên hệ và mạng xã hội. Bạn có thể dùng phần này để gắn email, GitHub, LinkedIn."
      />

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border p-5">
          <h3 className="text-base font-semibold">Email</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            <a className="underline underline-offset-4" href={`mailto:${siteConfig.contact.email}`}>
              {siteConfig.contact.email}
            </a>
          </p>
        </div>

        <div className="rounded-2xl border p-5">
          <h3 className="text-base font-semibold">Social</h3>
          <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
            {siteConfig.socials.map((s) => (
              <li key={s.label}>
                <a className="underline underline-offset-4" href={s.href} target="_blank">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Container>
  );
}
'@

# Tools
Write-File -Path "app/(public)/tools/page.tsx" -Content @'
import Link from "next/link";
import { Container } from "@/components/common/container";
import { PageHeader } from "@/components/common/page-header";

const tools = [
  { href: "/tools/ipa", name: "IPA Helper", desc: "Trang mẫu cho công cụ nhỏ: nhập text, hiển thị output." },
  { href: "/tools/clock", name: "Clock", desc: "Trang mẫu: đồng hồ realtime phía client." },
];

export default function ToolsPage() {
  return (
    <Container className="py-10">
      <PageHeader title="Tools" description="Các trang công cụ nhỏ (mini tools) theo phong cách gọn." />
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
'@

Write-File -Path "app/(public)/tools/ipa/page.tsx" -Content @'
"use client";

import { useMemo, useState } from "react";
import { Container } from "@/components/common/container";
import { PageHeader } from "@/components/common/page-header";

function toPseudoIPA(input: string) {
  // Đây là demo (không phải IPA chuẩn). Bạn có thể thay bằng thư viện/logic riêng sau.
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
        description="Demo công cụ nhỏ. Hiện dùng chuyển đổi giả lập (pseudo-IPA) để bạn có khung UI, dễ mở rộng."
      />

      <div className="mt-6 grid gap-4">
        <div className="rounded-2xl border p-5">
          <label className="text-sm font-medium">Input</label>
          <textarea
            className="mt-2 w-full rounded-xl border bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            rows={4}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Nhập câu tiếng Việt..."
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
          <p className="mt-2 text-xs text-muted-foreground">
            Gợi ý: Khi cần IPA chuẩn, bạn thay hàm <code>toPseudoIPA</code> bằng thư viện hoặc API xử lý.
          </p>
        </div>
      </div>
    </Container>
  );
}
'@

Write-File -Path "app/(public)/tools/clock/page.tsx" -Content @'
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
        <p className="mt-3 text-sm text-muted-foreground">
          Đồng hồ cập nhật mỗi giây, dùng làm mẫu cho trang tool.
        </p>
      </div>
    </Container>
  );
}
'@

# Tag page
Write-File -Path "app/(public)/tag/[tag]/page.tsx" -Content @'
import Link from "next/link";
import { Container } from "@/components/common/container";
import { PageHeader } from "@/components/common/page-header";
import { PostCard } from "@/components/cards/post-card";
import { ProjectCard } from "@/components/cards/project-card";
import { getPostsByTag } from "@/features/blog/blog.service";
import { getProjectsByTag } from "@/features/projects/projects.service";

export default function TagPage({ params }: { params: { tag: string } }) {
  const tag = decodeURIComponent(params.tag);
  const posts = getPostsByTag(tag);
  const projects = getProjectsByTag(tag);

  return (
    <Container className="py-10">
      <PageHeader
        title={`Tag: ${tag}`}
        description="Lọc nhanh theo tag (dùng chung cho blog và projects)."
      />

      <div className="mt-4 text-sm">
        <Link className="underline underline-offset-4" href="/search">
          Đi tới Search
        </Link>
      </div>

      <div className="mt-8 grid gap-8">
        <section>
          <h2 className="text-base font-semibold tracking-tight">Posts</h2>
          <div className="mt-4 grid gap-4">
            {posts.length ? posts.map((p) => <PostCard key={p.slug} post={p} />) : (
              <p className="text-sm text-muted-foreground">Không có bài viết phù hợp.</p>
            )}
          </div>
        </section>

        <section>
          <h2 className="text-base font-semibold tracking-tight">Projects</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {projects.length ? projects.map((p) => <ProjectCard key={p.slug} project={p} />) : (
              <p className="text-sm text-muted-foreground">Không có dự án phù hợp.</p>
            )}
          </div>
        </section>
      </div>
    </Container>
  );
}
'@

# Search page
Write-File -Path "app/(public)/search/page.tsx" -Content @'
import Link from "next/link";
import { Container } from "@/components/common/container";
import { PageHeader } from "@/components/common/page-header";
import { searchAll } from "@/features/site/search.service";
import { PostCard } from "@/components/cards/post-card";
import { ProjectCard } from "@/components/cards/project-card";

export default function SearchPage({ searchParams }: { searchParams?: { q?: string } }) {
  const q = (searchParams?.q ?? "").trim();
  const result = searchAll(q);

  return (
    <Container className="py-10">
      <PageHeader title="Search" description="Tìm nhanh nội dung trong blog và projects." />

      <form className="mt-6 flex gap-2" action="/search" method="get">
        <input
          name="q"
          defaultValue={q}
          placeholder="Nhập từ khoá..."
          className="h-10 w-full rounded-xl border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
        <button className="h-10 shrink-0 rounded-xl border px-4 text-sm font-medium hover:bg-muted" type="submit">
          Tìm
        </button>
      </form>

      {!q ? (
        <p className="mt-6 text-sm text-muted-foreground">
          Gợi ý: thử tìm “next”, “mvc”, “prisma”, “chartjs”… hoặc bấm tag ở bất kỳ bài/dự án nào.
        </p>
      ) : (
        <p className="mt-6 text-sm text-muted-foreground">
          Kết quả cho: <span className="font-medium text-foreground">{q}</span>
        </p>
      )}

      <div className="mt-8 grid gap-8">
        <section>
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-base font-semibold tracking-tight">Posts</h2>
            <Link className="text-sm underline underline-offset-4" href="/blog">Blog</Link>
          </div>
          <div className="mt-4 grid gap-4">
            {result.posts.length ? result.posts.map((p) => <PostCard key={p.slug} post={p} />) : (
              q ? <p className="text-sm text-muted-foreground">Không có bài viết phù hợp.</p> : null
            )}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-base font-semibold tracking-tight">Projects</h2>
            <Link className="text-sm underline underline-offset-4" href="/projects">Projects</Link>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {result.projects.length ? result.projects.map((p) => <ProjectCard key={p.slug} project={p} />) : (
              q ? <p className="text-sm text-muted-foreground">Không có dự án phù hợp.</p> : null
            )}
          </div>
        </section>
      </div>
    </Container>
  );
}
'@

# -----------------------------
# Components
# -----------------------------
Write-File -Path "components/common/container.tsx" -Content @'
import { cn } from "@/lib/utils";

export function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn("mx-auto w-full max-w-5xl px-4", className)}>{children}</div>;
}
'@

Write-File -Path "components/common/page-header.tsx" -Content @'
export function PageHeader({ title, description }: { title: string; description?: string }) {
  return (
    <header>
      <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
      {description ? <p className="mt-3 text-sm text-muted-foreground">{description}</p> : null}
    </header>
  );
}
'@

Write-File -Path "components/common/tag-pill.tsx" -Content @'
import Link from "next/link";

export function TagPill({ label, href }: { label: string; href: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
    >
      {label}
    </Link>
  );
}
'@

Write-File -Path "components/layout/nav-links.ts" -Content @'
export type NavLink = { href: string; label: string };

export const navLinks: NavLink[] = [
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/work/experience", label: "Experience" },
  { href: "/work/skills-and-tools", label: "Skills & Tools" },
  { href: "/tools", label: "Tools" },
  { href: "/contact", label: "Contact" },
];
'@

Write-File -Path "components/layout/mobile-nav.tsx" -Content @'
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { navLinks } from "./nav-links";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const links = useMemo(() => navLinks, []);

  return (
    <div className="sm:hidden">
      <button
        className="inline-flex h-9 items-center justify-center rounded-xl border px-3 text-sm font-medium hover:bg-muted"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Toggle menu"
      >
        Menu
      </button>

      {open ? (
        <div className="mt-2 rounded-2xl border bg-background p-2 shadow-sm">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "block rounded-xl px-3 py-2 text-sm hover:bg-muted",
                  active && "bg-muted font-medium"
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
'@

Write-File -Path "components/layout/header.tsx" -Content @'
import Link from "next/link";
import { Container } from "@/components/common/container";
import { navLinks } from "./nav-links";
import { MobileNav } from "./mobile-nav";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <Container className="flex h-14 items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm font-semibold tracking-tight">
            Home
          </Link>

          <nav className="hidden items-center gap-4 sm:flex">
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} className="text-sm text-muted-foreground hover:text-foreground">
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/search"
            className="hidden h-9 items-center justify-center rounded-xl border px-3 text-sm font-medium hover:bg-muted sm:inline-flex"
          >
            Search
          </Link>
          <MobileNav />
        </div>
      </Container>
    </header>
  );
}
'@

Write-File -Path "components/layout/footer.tsx" -Content @'
import { Container } from "@/components/common/container";
import { siteConfig } from "@/features/site/site.config";

export function Footer() {
  return (
    <footer className="border-t">
      <Container className="py-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-3 text-sm">
            {siteConfig.socials.map((s) => (
              <a key={s.label} href={s.href} target="_blank" className="text-muted-foreground hover:text-foreground">
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}
'@

# Sections
Write-File -Path "components/sections/hero.tsx" -Content @'
import Link from "next/link";
import { siteConfig } from "@/features/site/site.config";

export function Hero() {
  return (
    <section className="rounded-3xl border p-6 sm:p-8">
      <div className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">{siteConfig.badge}</p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          {siteConfig.hero.title}
        </h1>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
          {siteConfig.hero.description}
        </p>

        <div className="flex flex-wrap gap-3">
          <Link className="inline-flex h-10 items-center justify-center rounded-xl border px-4 text-sm font-medium hover:bg-muted" href="/projects">
            Xem Projects
          </Link>
          <Link className="inline-flex h-10 items-center justify-center rounded-xl border px-4 text-sm font-medium hover:bg-muted" href="/blog">
            Xem Blog
          </Link>
          <Link className="inline-flex h-10 items-center justify-center rounded-xl border px-4 text-sm font-medium hover:bg-muted" href="/contact">
            Liên hệ
          </Link>
        </div>
      </div>
    </section>
  );
}
'@

Write-File -Path "components/sections/quick-links.tsx" -Content @'
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
'@

Write-File -Path "components/sections/featured-projects.tsx" -Content @'
import { ProjectCard } from "@/components/cards/project-card";
import { getFeaturedProjects } from "@/features/projects/projects.service";

export function FeaturedProjects() {
  const projects = getFeaturedProjects();
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {projects.map((p) => (
        <ProjectCard key={p.slug} project={p} />
      ))}
    </div>
  );
}
'@

Write-File -Path "components/sections/featured-posts.tsx" -Content @'
import { PostCard } from "@/components/cards/post-card";
import { getFeaturedPosts } from "@/features/blog/blog.service";

export function FeaturedPosts() {
  const posts = getFeaturedPosts();
  return (
    <div className="grid gap-4">
      {posts.map((p) => (
        <PostCard key={p.slug} post={p} />
      ))}
    </div>
  );
}
'@

Write-File -Path "components/sections/experience-preview.tsx" -Content @'
import Link from "next/link";
import { experiences } from "@/features/work/work.data";

export function ExperiencePreview() {
  const top = experiences.slice(0, 2);

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {top.map((e) => (
        <div key={e.id} className="rounded-2xl border p-5">
          <div className="flex items-center justify-between gap-2">
            <div className="text-base font-semibold">{e.title}</div>
            <div className="text-xs text-muted-foreground">{e.period}</div>
          </div>
          <div className="mt-1 text-sm text-muted-foreground">{e.org}</div>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">
            {e.highlights.slice(0, 2).map((h, idx) => (
              <li key={idx}>{h}</li>
            ))}
          </ul>
          <div className="mt-3">
            <Link className="text-sm underline underline-offset-4" href="/work/experience">
              Xem thêm
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
'@

Write-File -Path "components/sections/cta-contact.tsx" -Content @'
import Link from "next/link";

export function CtaContact() {
  return (
    <div className="rounded-3xl border p-6 sm:p-8">
      <h3 className="text-xl font-semibold tracking-tight">Bạn muốn trao đổi về dự án?</h3>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
        Mình ưu tiên trao đổi rõ mục tiêu, phạm vi, và đầu ra. Nếu phù hợp, có thể bắt đầu từ một bản kế hoạch triển khai ngắn.
      </p>
      <div className="mt-5">
        <Link className="inline-flex h-10 items-center justify-center rounded-xl border px-4 text-sm font-medium hover:bg-muted" href="/contact">
          Đi tới Contact
        </Link>
      </div>
    </div>
  );
}
'@

# Cards
Write-File -Path "components/cards/project-card.tsx" -Content @'
import Link from "next/link";
import { TagPill } from "@/components/common/tag-pill";
import type { Project } from "@/features/projects/projects.types";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/projects/${project.slug}`} className="rounded-2xl border p-5 hover:bg-muted">
      <div className="text-base font-semibold">{project.name}</div>
      <p className="mt-2 text-sm text-muted-foreground">{project.summary}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {project.stack.slice(0, 4).map((t) => (
          <TagPill key={t} label={t} href={`/tag/${encodeURIComponent(t)}`} />
        ))}
      </div>
    </Link>
  );
}
'@

Write-File -Path "components/cards/post-card.tsx" -Content @'
import Link from "next/link";
import { TagPill } from "@/components/common/tag-pill";
import { formatDate } from "@/lib/date";
import type { Post } from "@/features/blog/blog.types";

export function PostCard({ post }: { post: Post }) {
  return (
    <Link href={`/blog/${post.slug}`} className="rounded-2xl border p-5 hover:bg-muted">
      <div className="flex flex-col gap-1">
        <div className="text-base font-semibold">{post.title}</div>
        <div className="text-xs text-muted-foreground">{formatDate(post.publishedAt)} · {post.readingTimeMinutes} phút</div>
      </div>

      <p className="mt-2 text-sm text-muted-foreground">{post.description}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {post.tags.slice(0, 5).map((t) => (
          <TagPill key={t} label={t} href={`/tag/${encodeURIComponent(t)}`} />
        ))}
      </div>
    </Link>
  );
}
'@

# -----------------------------
# Features + data
# -----------------------------
Write-File -Path "features/site/site.config.ts" -Content @'
export const siteConfig = {
  name: "My Portfolio",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  description: "Portfolio + blog theo phong cách gọn, rõ, dễ xem. Mở rộng được admin sau này.",
  badge: "Portfolio / Projects / Blog",
  author: {
    name: "Do Cong Minh",
    url: "https://github.com/",
  },
  hero: {
    title: "Xây website gọn, rõ, dễ mở rộng.",
    description:
      "Tập trung vào cấu trúc sạch và trải nghiệm đọc nội dung. Public site gồm Home, Projects, Blog, Work, Skills & Tools, Contact và một số mini tools.",
  },
  contact: {
    email: "your-email@example.com",
  },
  socials: [
    { label: "GitHub", href: "https://github.com/" },
    { label: "LinkedIn", href: "https://www.linkedin.com/" },
  ],
};
'@

Write-File -Path "features/site/search.service.ts" -Content @'
import { getAllPosts } from "@/features/blog/blog.service";
import { getAllProjects } from "@/features/projects/projects.service";

function includesCI(text: string, q: string) {
  return text.toLowerCase().includes(q.toLowerCase());
}

export function searchAll(q: string) {
  if (!q) return { posts: [], projects: [] };

  const posts = getAllPosts().filter((p) => {
    const hay = `${p.title} ${p.description} ${p.tags.join(" ")} ${p.content.join(" ")}`;
    return includesCI(hay, q);
  });

  const projects = getAllProjects().filter((p) => {
    const hay = `${p.name} ${p.summary} ${p.stack.join(" ")} ${p.content.join(" ")}`;
    return includesCI(hay, q);
  });

  return { posts, projects };
}
'@

# Blog
Write-File -Path "features/blog/blog.types.ts" -Content @'
export type Post = {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  content: string[];
  publishedAt: Date;
  updatedAt?: Date;
  featured?: boolean;
  readingTimeMinutes: number;
};
'@

Write-File -Path "features/blog/blog.data.ts" -Content @'
import type { Post } from "./blog.types";

export const posts: Post[] = [
  {
    slug: "nextjs-public-structure",
    title: "Cấu trúc Public Next.js (App Router) chuẩn để mở rộng",
    description: "Route groups, features/service/repo pattern và các trang cần có cho portfolio/blog.",
    tags: ["Next.js", "App Router", "Architecture"],
    publishedAt: new Date("2025-12-01"),
    readingTimeMinutes: 6,
    featured: true,
    content: [
      "Bài viết này tóm tắt cách tổ chức thư mục Public để dự án dễ mở rộng và bảo trì.",
      "Điểm mấu chốt: tách app routes và business logic theo module (features).",
      "Bạn có thể thay data file-based bằng DB và gắn admin sau này mà không phá cấu trúc.",
    ],
  },
  {
    slug: "clean-ui-ux-for-portfolio",
    title: "UI/UX gọn cho portfolio: ưu tiên nội dung",
    description: "Một bộ nguyên tắc đơn giản để trang nhìn chuyên nghiệp nhưng không rối.",
    tags: ["UI/UX", "Tailwind", "Portfolio"],
    publishedAt: new Date("2025-12-05"),
    readingTimeMinutes: 5,
    featured: true,
    content: [
      "Giảm nhiễu: ít màu, ít animation, typography rõ.",
      "Một layout nhất quán: Container + spacing theo nhịp.",
      "Card list rõ thông tin: title, 1–2 dòng mô tả, tags.",
    ],
  },
  {
    slug: "tag-search-pattern",
    title: "Tag + Search: pattern đơn giản nhưng hiệu quả",
    description: "Tạo tag page và search page để điều hướng nội dung nhanh.",
    tags: ["Search", "Tag", "Patterns"],
    publishedAt: new Date("2025-12-08"),
    readingTimeMinutes: 4,
    content: [
      "Tag giúp điều hướng theo chủ đề; Search giúp tìm theo từ khoá.",
      "Làm nhanh bằng filter trong service trước khi tối ưu bằng DB hoặc search engine.",
    ],
  },
];
'@

Write-File -Path "features/blog/blog.repo.ts" -Content @'
import { posts } from "./blog.data";
import type { Post } from "./blog.types";

export function listPosts(): Post[] {
  return [...posts];
}

export function findPostBySlug(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}
'@

Write-File -Path "features/blog/blog.service.ts" -Content @'
import type { Post } from "./blog.types";
import { findPostBySlug, listPosts } from "./blog.repo";

export function getAllPosts(): Post[] {
  return listPosts().sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
}

export function getFeaturedPosts(): Post[] {
  return getAllPosts().filter((p) => p.featured).slice(0, 2);
}

export function getPostBySlug(slug: string): Post | undefined {
  return findPostBySlug(slug);
}

export function getPostsByTag(tag: string): Post[] {
  const t = tag.toLowerCase();
  return getAllPosts().filter((p) => p.tags.some((x) => x.toLowerCase() === t));
}
'@

# Projects
Write-File -Path "features/projects/projects.types.ts" -Content @'
export type Project = {
  slug: string;
  name: string;
  summary: string;
  stack: string[];
  content: string[];
  featured?: boolean;
  updatedAt?: Date;
  links: {
    demo?: string;
    repo?: string;
  };
};
'@

Write-File -Path "features/projects/projects.data.ts" -Content @'
import type { Project } from "./projects.types";

export const projects: Project[] = [
  {
    slug: "airline-ticket-booking",
    name: "Airline Ticket Booking (ASP.NET Core MVC)",
    summary: "Hệ thống đặt vé: quản lý chuyến bay, ghế ngồi, vé, thanh toán và dashboard.",
    stack: ["ASP.NET Core", "EF Core", "SQL Server", "Chart.js"],
    featured: true,
    links: { demo: "", repo: "" },
    content: [
      "Mục tiêu: mô hình hoá dữ liệu rõ, CRUD đầy đủ và dashboard thống kê.",
      "Điểm nhấn: phân trang, tìm kiếm, export Excel/PDF, biểu đồ doanh thu.",
      "Mở rộng: test xUnit, seed dữ liệu đa dạng cho thống kê.",
    ],
  },
  {
    slug: "portfolio-nextjs-public",
    name: "Portfolio Next.js (Public)",
    summary: "Public site giống phong cách luoi.dev: Home, Projects, Blog, Work, Skills, Tools.",
    stack: ["Next.js", "TypeScript", "Tailwind"],
    featured: true,
    links: { demo: "", repo: "" },
    content: [
      "Tập trung cấu trúc sạch: app routes + features + components.",
      "Có tag/search giúp điều hướng nội dung nhanh.",
      "Sẵn sàng gắn admin sau này mà không phá cấu trúc.",
    ],
  },
  {
    slug: "library-management-java",
    name: "Library Management (Java Swing + MySQL)",
    summary: "Ứng dụng quản lý thư viện: sách, độc giả, phiếu mượn, chi tiết phiếu mượn.",
    stack: ["Java Swing", "MySQL", "JDBC"],
    links: { demo: "", repo: "" },
    content: [
      "Thiết kế form theo module: Sách/Tác giả/NXB/Độc giả/Nhân viên.",
      "Kết nối MySQL, CRUD đầy đủ, validate dữ liệu đầu vào.",
    ],
  },
];
'@

Write-File -Path "features/projects/projects.repo.ts" -Content @'
import { projects } from "./projects.data";
import type { Project } from "./projects.types";

export function listProjects(): Project[] {
  return [...projects];
}

export function findProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
'@

Write-File -Path "features/projects/projects.service.ts" -Content @'
import type { Project } from "./projects.types";
import { findProjectBySlug, listProjects } from "./projects.repo";

export function getAllProjects(): Project[] {
  return listProjects().sort((a, b) => (b.updatedAt?.getTime() ?? 0) - (a.updatedAt?.getTime() ?? 0));
}

export function getFeaturedProjects(): Project[] {
  return getAllProjects().filter((p) => p.featured).slice(0, 2);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return findProjectBySlug(slug);
}

export function getProjectsByTag(tag: string): Project[] {
  const t = tag.toLowerCase();
  return getAllProjects().filter((p) => p.stack.some((x) => x.toLowerCase() === t));
}
'@

# Work data
Write-File -Path "features/work/work.data.ts" -Content @'
export const experiences = [
  {
    id: "exp-1",
    title: "Student / Developer",
    org: "UNETI / Personal Projects",
    period: "2024 — 2025",
    highlights: [
      "Xây dựng web app theo mô hình MVC, chú trọng cấu trúc và khả năng mở rộng.",
      "Thiết kế database và seed dữ liệu phục vụ dashboard và test.",
      "Thực hành kiểm thử: test case, xUnit, kiểm thử chức năng.",
    ],
  },
  {
    id: "exp-2",
    title: "Full-stack Practice",
    org: "Next.js + .NET + SQL",
    period: "2025",
    highlights: [
      "Tối ưu UI/UX theo hướng gọn, dễ đọc, tập trung nội dung.",
      "Triển khai tính năng tìm kiếm, lọc, phân trang cho danh sách.",
    ],
  },
];

export const skills = [
  "C#",
  "ASP.NET Core MVC",
  "EF Core",
  "SQL Server",
  "Next.js",
  "TypeScript",
  "REST API",
  "Testing (xUnit)",
];

export const tools = [
  "Visual Studio",
  "VS Code",
  "Git/GitHub",
  "Postman",
  "Docker",
  "Figma",
];
'@

# -----------------------------
# lib
# -----------------------------
Write-File -Path "lib/utils.ts" -Content @'
export function cn(...classes: Array<string | undefined | false | null>) {
  return classes.filter(Boolean).join(" ");
}
'@

Write-File -Path "lib/date.ts" -Content @'
export function formatDate(d: Date) {
  try {
    return new Intl.DateTimeFormat("vi-VN", { year: "numeric", month: "short", day: "2-digit" }).format(d);
  } catch {
    return d.toISOString().slice(0, 10);
  }
}
'@

# -----------------------------
# styles
# -----------------------------
Write-File -Path "styles/globals.css" -Content @'
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --ring: 215 20.2% 65.1%;
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --muted: 217.2 32.6% 17.5%;
  --muted-foreground: 215 20.2% 65.1%;
  --ring: 215 20.2% 65.1%;
}

body {
  background: hsl(var(--background));
  color: hsl(var(--foreground));
}
'@

# -----------------------------
# Tailwind + Next config (overwrite to include folders)
# -----------------------------
Write-File -Path "tailwind.config.ts" -Content @'
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./features/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        muted: "hsl(var(--muted))",
        "muted-foreground": "hsl(var(--muted-foreground))",
        ring: "hsl(var(--ring))",
      },
    },
  },
  plugins: [],
};

export default config;
'@

Write-File -Path "next.config.ts" -Content @'
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
};

export default nextConfig;
'@

Write-Host "`nDone. Next step: npm run dev`n"
