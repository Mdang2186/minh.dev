import Link from "next/link";
import { Container } from "@/components/common/container";
import { Hero } from "@/components/sections/hero";
import { FeaturedProjects } from "@/components/sections/featured-projects";
import { FeaturedPosts } from "@/components/sections/featured-posts";

export default function HomePage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Container className="py-4">
                {/* Hero Section */}
                <Hero />

                {/* Feature Cards - Bento Grid */}
                <section className="grid gap-6 md:grid-cols-3 py-16">
                    <div className="rounded-2xl border border-border bg-card p-8 shadow-sm transition-all hover:shadow-md">
                        <h3 className="text-xl font-bold mb-3">Clean & Intuitive</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Eye Catching, Modern & Minimalist Design.
                        </p>
                        <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                            Keep the User Interface clean with a modern touch without compromising the User Experience.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-8 shadow-sm transition-all hover:shadow-md">
                        <h3 className="text-xl font-bold mb-3">Detail Oriented</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Keen Eye for Spotting Small Details.
                        </p>
                        <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                            Awareness to ease of access, User Interface consistency, and improved User Experience.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-8 shadow-sm transition-all hover:shadow-md">
                        <h3 className="text-xl font-bold mb-3">Pretty & Optimized</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Comprehensible and Optimized Code.
                        </p>
                        <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                            Writing clean code is a top priority while keeping it as optimized as possible.
                        </p>
                    </div>
                </section>

                {/* Projects Section */}
                <section className="space-y-8 py-16 border-t border-border">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold tracking-tight">Featured Projects</h2>
                        <Link
                            href="/projects"
                            className="text-sm font-medium text-primary hover:underline"
                        >
                            View All →
                        </Link>
                    </div>
                    <FeaturedProjects />
                </section>

                {/* Blog Section */}
                <section className="space-y-8 py-16 border-t border-border">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold tracking-tight">Latest Posts</h2>
                        <Link
                            href="/blog"
                            className="text-sm font-medium text-primary hover:underline"
                        >
                            Read All →
                        </Link>
                    </div>
                    <FeaturedPosts />
                </section>
            </Container>
        </div>
    );
}
