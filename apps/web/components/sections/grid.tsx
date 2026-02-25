"use client";

import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { siteConfig } from "@/features/site/site.config";
import { Globe, Terminal, Monitor, ArrowUpRight } from "lucide-react";
import { TechBadge } from "@/components/ui/tech-badge";
import Link from "next/link";

export function Grid() {
    return (
        <section id="about" className="py-32 bg-zinc-50 border-t border-zinc-100">
            <div className="container mb-12">
                <h2 className="text-4xl md:text-5xl font-black tracking-tight text-zinc-900 mb-4">THE STUDIO.</h2>
                <p className="text-xl text-zinc-500 max-w-2xl font-medium">Inside the process of crafting digital excellence.</p>
            </div>
            <BentoGrid className="w-full px-4">
                {gridItems.map((item, i) => (
                    <BentoGridItem
                        id={item.id}
                        key={i}
                        title={item.title}
                        description={item.description}
                        className={item.className}
                        header={item.header}
                        icon={item.icon}
                    />
                ))}
            </BentoGrid>
        </section>
    );
}

const gridItems = [
    {
        id: 1,
        title: (
            <span className="text-2xl font-bold block mt-2">PROJECT SHOWCASE</span>
        ),
        description: (
            <span className="text-lg font-medium text-zinc-500">Visualizing the flow of successful deployments.</span>
        ),
        className: "lg:col-span-2 md:col-span-3 lg:row-span-2 min-h-[50vh]",
        header: (
            <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-zinc-900 overflow-hidden relative group">
                <div className="absolute inset-0 flex items-center justify-center p-8 transition-transform duration-500 group-hover:scale-105">
                    <div className="w-full h-full bg-zinc-800/50 rounded-lg flex items-center justify-center border border-zinc-700">
                        <span className="text-zinc-400 font-bold text-xl tracking-widest">LATEST WORK</span>
                    </div>
                </div>
                <div className="absolute top-6 right-6 z-10">
                    <div className="bg-white rounded-full p-2">
                        <ArrowUpRight className="h-6 w-6 text-black" />
                    </div>
                </div>
            </div>
        ),
        icon: <Monitor className="h-5 w-5 text-zinc-900" />,
    },
    {
        id: 2,
        title: <span className="text-xl font-bold">TECH ARSENAL</span>,
        description: "Production-grade toolkit.",
        className: "lg:col-span-1 md:col-span-3 lg:row-span-1",
        header: (
            <div className="flex flex-wrap gap-2 p-6 h-full items-center justify-center bg-white rounded-xl border border-zinc-200">
                <TechBadge name="Next.js" />
                <TechBadge name="React" />
                <TechBadge name="TypeScript" />
            </div>
        ),
        icon: <Terminal className="h-5 w-5 text-zinc-900" />,
    },
    {
        id: 3,
        title: <span className="text-xl font-bold">GLOBAL</span>,
        description: "Remote ready.",
        className: "lg:col-span-1 md:col-span-3 lg:row-span-1",
        header: (
            <div className="flex flex-1 w-full h-full min-h-[6rem] items-center justify-center rounded-xl bg-zinc-100 border border-zinc-200">
                <Globe className="h-20 w-20 text-zinc-300 stroke-1" />
            </div>
        ),
        icon: <Globe className="h-5 w-5 text-zinc-900" />,
    },
];
