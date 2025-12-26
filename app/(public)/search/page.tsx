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
        <button
          className="h-10 shrink-0 rounded-xl border px-4 text-sm font-medium hover:bg-muted"
          type="submit"
        >
          Tìm
        </button>
      </form>

      {!q ? (
        <p className="mt-6 text-sm text-muted-foreground">
          Gợi ý: thử tìm “next”, “mvc”, “sql”… hoặc bấm tag ở bất kỳ bài/dự án nào.
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
