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
      <PageHeader title={`Tag: ${tag}`} description="Lọc nội dung theo tag (blog + projects)." />

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
