import Link from "next/link";
import { Container } from "@/components/common/container";
import { Hero } from "@/components/sections/hero";
import { FeaturedProjects } from "@/components/sections/featured-projects";
import { Quote } from "@/components/sections/quote";
import { RoadmapTimeline } from "@/components/sections/roadmap-timeline";
import { DesignFeature } from "@/components/sections/design-feature";
import { getPublicProjects, getPublicTimelineNodes } from "@/features/portfolio/portfolio.service";
import { getTranslations } from "next-intl/server";

export const revalidate = 3600; // Cache data for 1 hour

export default async function HomePage() {
    const featuredProjects = await getPublicProjects({ featured: true, limit: 3 });
    const timelineNodes = await getPublicTimelineNodes();
    const t = await getTranslations("HomePage");

    return (
        <div className="flex flex-col min-h-screen pb-10 bg-background text-foreground selection:bg-primary/30">
            <Hero />

            {/* Quote Section — full bleed, no shadow */}
            <Quote />

            {/* My Journey — Full-Width */}
            <div>
                <RoadmapTimeline nodes={timelineNodes} />
            </div>

            <div className="w-full px-4 sm:px-6 relative z-10 mt-4">
                {/* Design Feature Section — full bleed */}
                <DesignFeature />

                {/* Projects Section */}
                <section className="space-y-6 py-8 md:py-12 relative max-w-[90rem] mx-auto mt-2">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"></div>
                    <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4 px-4">
                        <div className="text-center sm:text-left">
                            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground mb-2">{t("featuredWork")}</h2>
                            <p className="text-base text-muted-foreground font-medium">{t("bestProjects")}</p>
                        </div>
                        <Link
                            href="/work/projects"
                            className="group flex items-center gap-2 text-xs sm:text-sm font-bold text-primary hover:text-primary-foreground transition-all duration-300 bg-white/5 hover:bg-primary/90 border border-white/10 hover:border-primary backdrop-blur-md px-5 py-2.5 rounded-full uppercase tracking-wider hover:shadow-primary/20"
                        >
                            {t("viewAll")}
                            <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
                        </Link>
                    </div>
                    <FeaturedProjects projects={featuredProjects} />
                </section>
            </div>
        </div>
    );
}

