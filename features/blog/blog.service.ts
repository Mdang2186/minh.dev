import type { Post } from "./blog.types";
import { findPostBySlug, listPosts } from "./blog.repo";

export function getAllPosts(): Post[] {
  return listPosts().sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
}

export function getFeaturedPosts(): Post[] {
  return getAllPosts().filter((p) => p.featured).slice(0, 2);
}

export function getPostBySlug(slug: string): Post | undefined {
  return findPostBySlug(slug);
}

export function getPostsByTag(tag: string): Post[] {
  const t = tag.toLowerCase();
  return getAllPosts().filter((p) => p.tags.some((x) => x.toLowerCase() === t));
}
