"use client";

import { projects } from "@/data";
import { ProductCard } from "@/components/ui/product-card";
import { Container } from "@/components/common/container";

export default function ProjectsPage() {
  return (
    <Container className="py-24 md:py-32">
      <div className="mb-16 max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tighter text-foreground md:text-6xl lg:text-7xl">
          Selected Projects
        </h1>
        <p className="mt-6 text-xl text-muted-foreground leading-relaxed font-normal">
          A showcase of my recent work, side projects, and open-source contributions.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((item) => (
          <ProductCard
            key={item.id}
            id={item.id}
            title={item.title}
            des={item.des}
            img={item.img}
            iconLists={item.iconLists}
            link={item.link}
          />
        ))}
      </div>
    </Container>
  );
}
