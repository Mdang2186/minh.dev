import { SkillsPageClient } from "@/components/sections/skills/skills-page-client";
import { getPublicSkillGroups } from "@/features/portfolio/portfolio.service";

export const dynamic = "force-dynamic";

export default async function SkillsToolsPage() {
  const groups = await getPublicSkillGroups();
  return <SkillsPageClient groups={groups} />;
}
