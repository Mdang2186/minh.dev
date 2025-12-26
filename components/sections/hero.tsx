"use client";

import Link from "next/link";
import { siteConfig } from "@/features/site/site.config";
import { ArrowRight, Code2, Database, Layout, Smartphone } from "lucide-react";

// Tech stack icons
const techStack = [
    { name: "Frontend", icon: <Layout className="h-6 w-6" /> },
    { name: "Backend", icon: <Database className="h-6 w-6" /> },
    { name: "Mobile", icon: <Smartphone className="h-6 w-6" /> },
    { name: "Architecture", icon: <Code2 className="h-6 w-6" /> },
];

export function Hero() {
    return (
        <section className="relative flex flex-col items-start gap-10 py-24 md:py-32">
            {/* Main Heading */}
            <h1 className="text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl leading-tight">
                <span className="text-primary block mb-2 text-xl md:text-2xl font-semibold tracking-normal">Hello, I'm {siteConfig.author.name}</span>
                Digital Craftsman.
            </h1>

            <p className="max-w-2xl text-xl md:text-2xl text-muted-foreground leading-relaxed font-normal">
                I design and build <span className="text-foreground font-medium">minimalist</span>, <span className="text-foreground font-medium">high-performance</span> digital products.
                Focused on creating refined web experiences.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4">
                <Link
                    href="/contact"
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-8 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:scale-105 hover:shadow-xl hover:shadow-primary/30 active:scale-95"
                >
                    Get in Touch
                    <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                    href="/projects"
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-input bg-background px-8 text-sm font-semibold shadow-sm transition-all hover:bg-accent hover:text-accent-foreground active:scale-95"
                >
                    View Projects
                </Link>
            </div>

            {/* Tech Stack */}
            <div className="space-y-4 pt-8">
                <p className="text-sm font-medium text-muted-foreground/80 uppercase tracking-widest">
                    Focusing on
                </p>
                <div className="flex flex-wrap items-center gap-4">
                    {techStack.map((tech) => (
                        <div
                            key={tech.name}
                            className="flex items-center gap-3 rounded-2xl border border-border bg-card/50 px-5 py-3 shadow-sm backdrop-blur-sm transition-all hover:border-primary/50 hover:bg-card hover:shadow-md"
                            title={tech.name}
                        >
                            <span className="text-primary">{tech.icon}</span>
                            <span className="text-sm font-semibold">{tech.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
