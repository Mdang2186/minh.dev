import { posts } from "./blog.data";
import type { Post } from "./blog.types";

export function listPosts(): Post[] {
  return [...posts];
}

export function findPostBySlug(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}
