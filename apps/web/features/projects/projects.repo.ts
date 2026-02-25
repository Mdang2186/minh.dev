import { projects } from "./projects.data";
import type { Project } from "./projects.types";

export function listProjects(): Project[] {
  return [...projects];
}

export function findProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
