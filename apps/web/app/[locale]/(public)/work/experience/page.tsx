import { ExperiencePageClient } from "@/components/sections/experience/experience-page-client";
import { SkillsPageClient } from "@/components/sections/skills/skills-page-client";
import { getPublicExperiences, getPublicProjects, getPublicSkillGroups } from "@/features/portfolio/portfolio.service";

export const dynamic = "force-dynamic";

export default async function ExperiencePage() {
  const experiences = await getPublicExperiences();
  const projects = await getPublicProjects();
  const skillGroups = await getPublicSkillGroups();
  
  return (
    <>
      <ExperiencePageClient experiences={experiences} projects={projects} />
      <SkillsPageClient groups={skillGroups} />
    </>
  );
}
