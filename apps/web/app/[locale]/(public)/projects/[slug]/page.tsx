import { notFound } from "next/navigation";
import { getPublicProjectBySlug } from "@/features/portfolio/portfolio.service";
import { ProjectDetailView } from "@/components/sections/projects/project-detail-view";

export const dynamic = "force-dynamic";

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getPublicProjectBySlug(slug);
  if (!project) return notFound();

  return <ProjectDetailView project={project} />;
}
