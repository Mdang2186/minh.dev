import Link from "next/link";
import { getAllPosts } from "@/features/blog/blog.service";

export default function AdminPostsPage() {
  const posts = getAllPosts();

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-xl font-semibold">Posts</h1>
        <Link className="text-sm underline underline-offset-4" href="/blog">
          View public blog
        </Link>
      </div>

      <div className="rounded-2xl border">
        <div className="grid grid-cols-12 border-b px-4 py-3 text-xs text-muted-foreground">
          <div className="col-span-6">Title</div>
          <div className="col-span-3">Tags</div>
          <div className="col-span-3 text-right">Reading time</div>
        </div>

        {posts.map((p) => (
          <div key={p.slug} className="grid grid-cols-12 px-4 py-3 text-sm hover:bg-muted">
            <div className="col-span-6 font-medium">{p.title}</div>
            <div className="col-span-3 text-muted-foreground">{p.tags.join(", ")}</div>
            <div className="col-span-3 text-right text-muted-foreground">{p.readingTimeMinutes}m</div>
          </div>
        ))}
      </div>
    </div>
  );
}
