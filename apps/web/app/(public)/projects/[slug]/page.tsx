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
