"use client";

import { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Card, CardDesc, CardTitle } from "@/components/ui/card";
import { projects, Project } from "@/data/site";
import { ProjectModal } from "@/components/ui/project-modal";

export function FeaturedProjects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const top = projects.slice(0, 3);

  return (
    <section className="mt-12">
      <Container>
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100">
              Featured Projects
            </h2>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
              A few things I have built recently — focused on usability and clean UI.
            </p>
          </div>
          <Link
            href="/work/projects"
            className="text-sm font-semibold text-neutral-700 hover:underline dark:text-neutral-200"
          >
            View all
          </Link>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {top.map((p) => (
            <div
              key={p.slug}
              className="h-full cursor-pointer group"
              onClick={() => setSelectedProject(p)}
            >
              <Card className="flex flex-col h-full hover:shadow-lg transition-shadow">
                <CardTitle className="group-hover:text-cyan-600 transition-colors">{p.name}</CardTitle>
                <CardDesc className="flex-grow">{p.summary}</CardDesc>

                <div className="mt-4 flex flex-wrap gap-2">
                  {p.stack.slice(0, 3).map((s) => (
                    <Badge key={s}>{s}</Badge>
                  ))}
                  {p.stack.length > 3 && (
                    <Badge>+{p.stack.length - 3}</Badge>
                  )}
                </div>

                <div className="mt-5 flex flex-wrap gap-3 pointer-events-none">
                  <span className="text-sm font-semibold text-cyan-600 dark:text-cyan-400">
                    Learn more →
                  </span>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </Container>

      <ProjectModal
        selectedProject={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
}
