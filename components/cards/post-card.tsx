import Link from "next/link";
import { formatDate } from "@/lib/date";
import type { Post } from "@/features/blog/blog.types";

export function PostCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col justify-between gap-3 rounded-lg border border-transparent p-4 transition-colors hover:bg-muted/50 hover:border-border/50 sm:flex-row sm:items-center"
    >
      <div className="flex flex-col gap-1">
        <h3 className="font-medium text-foreground group-hover:underline decoration-muted-foreground/50 underline-offset-4">
          {post.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-1">
          {post.description}
        </p>
      </div>

      <div className="shrink-0 text-sm text-muted-foreground tabular-nums">
        {formatDate(post.publishedAt)}
      </div>
    </Link>
  );
}
