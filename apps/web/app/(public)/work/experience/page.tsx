import { ExperiencePageClient } from "@/components/sections/experience/experience-page-client";
import { getPublicExperiences, getPublicProjects } from "@/features/portfolio/portfolio.service";

export const dynamic = "force-dynamic";

export default async function ExperiencePage() {
  const experiences = await getPublicExperiences();
  const projects = await getPublicProjects();
  return <ExperiencePageClient experiences={experiences} projects={projects} />;
}
