import type { Project } from "./projects.types";
import { findProjectBySlug, listProjects } from "./projects.repo";

export function getAllProjects(): Project[] {
  return listProjects().sort(
    (a, b) => (b.updatedAt?.getTime() ?? 0) - (a.updatedAt?.getTime() ?? 0)
  );
}

export function getFeaturedProjects(): Project[] {
  return getAllProjects().filter((p) => p.featured).slice(0, 2);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return findProjectBySlug(slug);
}

export function getProjectsByTag(tag: string): Project[] {
  const t = tag.toLowerCase();
  return getAllProjects().filter((p) => p.stack.some((x) => x.toLowerCase() === t));
}
