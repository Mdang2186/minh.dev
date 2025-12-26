import { PostCard } from "@/components/cards/post-card";
import { getFeaturedPosts } from "@/features/blog/blog.service";

export function FeaturedPosts() {
  const posts = getFeaturedPosts();
  return (
    <div className="grid gap-4">
      {posts.map((p) => (
        <PostCard key={p.slug} post={p} />
      ))}
    </div>
  );
}
