import { getAllPosts } from "@/features/blog/blog.service";
import type { Post } from "@/features/blog/blog.types";
import { getPublicProjects } from "@/features/portfolio/portfolio.service";
import type { PublicProject } from "@/features/portfolio/portfolio.types";

export type SearchResult = {
  posts: Post[];
  projects: PublicProject[];
};

function includesCI(text: string, q: string) {
  return text.toLowerCase().includes(q.toLowerCase());
}

export async function searchAll(q: string): Promise<SearchResult> {
  if (!q) return { posts: [], projects: [] };

  const posts = getAllPosts().filter((p) => {
    const hay = `${p.title} ${p.description} ${p.tags.join(" ")} ${p.content.join(" ")}`;
    return includesCI(hay, q);
  });

  const publicProjects = await getPublicProjects();
  const projects = publicProjects.filter((p) => {
    const hay = `${p.name} ${p.summary} ${p.stack.join(" ")} ${p.content.join(" ")}`;
    return includesCI(hay, q);
  });

  return { posts, projects };
}
