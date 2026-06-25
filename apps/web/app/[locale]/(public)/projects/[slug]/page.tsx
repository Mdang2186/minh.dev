import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/common/container";
import { TagPill } from "@/components/common/tag-pill";
import { getPublicProjectBySlug } from "@/features/portfolio/portfolio.service";

export const dynamic = "force-dynamic";

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getPublicProjectBySlug(slug);
  if (!project) return notFound();

  return (
    <Container className="py-10">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold tracking-tight">{project.name}</h1>
        <p className="text-muted-foreground">{project.summary}</p>

        <div className="flex flex-wrap gap-2">
          {project.stack.map((tag) => (
            <TagPill key={tag} label={tag} href={`/tag/${encodeURIComponent(tag)}`} />
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
          <Link className="underline underline-offset-4" href="/work/projects">
            Quay lại Projects
          </Link>
        </div>
      </div>

      <article className="prose prose-neutral mt-10 max-w-none dark:prose-invert">
        {project.content.map((block) => (
          <p key={block}>{block}</p>
        ))}
      </article>
    </Container>
  );
}
