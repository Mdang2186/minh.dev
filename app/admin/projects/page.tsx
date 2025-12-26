import Link from "next/link";
import { getAllProjects } from "@/features/projects/projects.service";

export default function AdminProjectsPage() {
  const projects = getAllProjects();

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-xl font-semibold">Projects</h1>
        <Link className="text-sm underline underline-offset-4" href="/projects">
          View public projects
        </Link>
      </div>

      <div className="rounded-2xl border">
        <div className="grid grid-cols-12 border-b px-4 py-3 text-xs text-muted-foreground">
          <div className="col-span-6">Name</div>
          <div className="col-span-4">Stack</div>
          <div className="col-span-2 text-right">Featured</div>
        </div>

        {projects.map((p) => (
          <div key={p.slug} className="grid grid-cols-12 px-4 py-3 text-sm hover:bg-muted">
            <div className="col-span-6 font-medium">{p.name}</div>
            <div className="col-span-4 text-muted-foreground">{p.stack.join(", ")}</div>
            <div className="col-span-2 text-right text-muted-foreground">
              {p.featured ? "Yes" : "No"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
