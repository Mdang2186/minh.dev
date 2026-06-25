import { ProjectsPageClient } from "@/components/sections/projects/projects-page-client";
import { getPublicProjects } from "@/features/portfolio/portfolio.service";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const projects = await getPublicProjects();
  return <ProjectsPageClient projects={projects} />;
}
