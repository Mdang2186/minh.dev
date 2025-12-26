"use client";

import { Container } from "@/components/common/container";
import { BlogCard } from "@/components/ui/blog-card";
import { getAllPosts } from "@/features/blog/blog.service";

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <Container className="py-24 md:py-32">
      <div className="mb-20 space-y-6 max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tighter text-foreground md:text-6xl lg:text-7xl">
          Writing
        </h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          Technical notes, architectural decisions, and thoughts on software engineering.
        </p>
      </div>

      <div className="flex flex-col border-t border-border">
        {posts.map((p) => (
          <BlogCard key={p.slug} post={p} />
        ))}
        {posts.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-lg text-muted-foreground">No posts found yet.</p>
          </div>
        )}
      </div>
    </Container>
  );
}
