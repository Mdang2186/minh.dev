import { Container } from "@/components/common/container";
import { ProjectCard } from "@/components/cards/project-card";
import { getPublicProjects } from "@/features/portfolio/portfolio.service";
import type { PublicProject } from "@/features/portfolio/portfolio.types";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const projects = await getPublicProjects();

  return (
    <Container className="py-24 md:py-32">
      <div className="mb-16 max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tighter text-foreground md:text-6xl lg:text-7xl">
          Selected Projects
        </h1>
        <p className="mt-6 text-xl text-muted-foreground leading-relaxed font-normal">
          A showcase of my recent work, side projects, and open-source contributions.
        </p>
      </div>

      <div className="grid gap-4">
        {projects.length ? (
          projects.map((project: PublicProject) => <ProjectCard key={project.slug} project={project} />)
        ) : (
          <p className="text-sm text-muted-foreground">Project content is being prepared.</p>
        )}
      </div>
    </Container>
  );
}
