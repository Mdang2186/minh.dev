import Link from "next/link";
import { Container } from "@/components/common/container";
import { Hero } from "@/components/sections/hero";
import { FeaturedProjects } from "@/components/sections/featured-projects";
import { Quote } from "@/components/sections/quote";
import { DesignFeature } from "@/components/sections/design-feature";
import { getPublicProjects } from "@/features/portfolio/portfolio.service";

export default async function HomePage() {
    const featuredProjects = await getPublicProjects({ featured: true, limit: 3 });

    return (
        <div className="flex flex-col min-h-screen pb-20">
            <Hero />

            <Container className="py-4 relative z-10">
                {/* Quote Section */}
                <Quote />

                {/* Design Feature Section */}
                <DesignFeature />

                {/* Projects Section */}
                <section className="space-y-10 py-20 relative max-w-7xl mx-auto">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-cyan-200/50 to-transparent"></div>
                    <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6 px-4">
                        <div className="text-center sm:text-left">
                            <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-2">Featured Work</h2>
                            <p className="text-lg text-slate-500 font-medium">Some of my best projects so far.</p>
                        </div>
                        <Link
                            href="/work/projects"
                            className="group flex items-center gap-2 text-sm font-bold text-cyan-600 hover:text-cyan-700 transition-all duration-300 bg-white shadow-sm border border-cyan-100 hover:border-cyan-300 hover:shadow-md px-6 py-3 rounded-full uppercase tracking-wider"
                        >
                            View All Projects
                            <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
                        </Link>
                    </div>
                    <div className="mt-8 rounded-[3rem] overflow-hidden bg-white/60 border border-white p-4 sm:p-10 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(6,182,212,0.05)] transition-shadow duration-500">
                        <FeaturedProjects projects={featuredProjects} />
                    </div>
                </section>

            </Container>
        </div>
    );
}
