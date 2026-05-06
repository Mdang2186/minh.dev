import { getAllPosts } from "@/features/blog/blog.service";
import { getPublicProjects } from "@/features/portfolio/portfolio.service";

function includesCI(text: string, q: string) {
  return text.toLowerCase().includes(q.toLowerCase());
}

export async function searchAll(q: string) {
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
