import { ProductCard } from "@/components/ui/product-card";
import { getFeaturedProjects } from "@/features/projects/projects.service";

export function FeaturedProjects() {
  const projects = getFeaturedProjects();
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((p, index) => (
        <ProductCard
          key={p.slug}
          id={index}
          title={p.name}
          des={p.summary}
          img={p.img || "/next.svg"}
          iconLists={p.iconLists || ["/next.svg"]}
          link={p.links.demo || p.links.repo || "/"}
        />
      ))}
    </div>
  );
}
