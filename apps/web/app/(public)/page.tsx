import Link from "next/link";
import { Container } from "@/components/common/container";
import { Hero } from "@/components/sections/hero";
import { FeaturedProjects } from "@/components/sections/featured-projects";
import { FeaturedPosts } from "@/components/sections/featured-posts";
import { Sparkles, Heart, Code2 } from "lucide-react";

export default function HomePage() {
    return (
        <div className="flex flex-col min-h-screen pb-20">
            <Hero />

            <Container className="py-4 relative z-10">
                {/* Feature Cards - Modern Glassmorphic Dashboard View */}
                <section className="grid gap-6 md:grid-cols-3 py-16 mt-8 max-w-7xl mx-auto">

                    {/* Card 1: Clean & Intuitive */}
                    <div className="group relative flex flex-col bg-white/60 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(6,182,212,0.12)] hover:-translate-y-2 transition-all duration-500 overflow-hidden cursor-default">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 group-hover:scale-110 transition-all duration-500 pointer-events-none">
                            <Sparkles className="w-40 h-40 text-cyan-500" />
                        </div>
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white mb-6 shadow-lg shadow-cyan-500/30 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-bold mb-3 text-slate-800 tracking-tight">Clean & Intuitive</h3>
                        <p className="text-[15px] font-medium text-slate-500 leading-relaxed relative z-10">
                            Eye Catching, Modern & Minimalist Design. Keep the UI clean with a modern touch without compromising UX.
                        </p>
                    </div>

                    {/* Card 2: Detail Oriented */}
                    <div className="group relative flex flex-col bg-white/60 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(6,182,212,0.12)] hover:-translate-y-2 transition-all duration-500 overflow-hidden cursor-default">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 group-hover:scale-110 transition-all duration-500 pointer-events-none">
                            <Heart className="w-40 h-40 text-cyan-500" />
                        </div>
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white mb-6 shadow-lg shadow-teal-500/30 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500">
                            <Heart className="w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-bold mb-3 text-slate-800 tracking-tight">Detail Oriented</h3>
                        <p className="text-[15px] font-medium text-slate-500 leading-relaxed relative z-10">
                            Keen Eye for Spotting Small Details. Awareness to ease of access, UI consistency, and improved UX.
                        </p>
                    </div>

                    {/* Card 3: Fast & Optimized */}
                    <div className="group relative flex flex-col bg-white/60 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(6,182,212,0.12)] hover:-translate-y-2 transition-all duration-500 overflow-hidden cursor-default">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 group-hover:scale-110 transition-all duration-500 pointer-events-none">
                            <Code2 className="w-40 h-40 text-cyan-500" />
                        </div>
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white mb-6 shadow-lg shadow-blue-500/30 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                            <Code2 className="w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-bold mb-3 text-slate-800 tracking-tight">Fast & Optimized</h3>
                        <p className="text-[15px] font-medium text-slate-500 leading-relaxed relative z-10">
                            Comprehensible and Optimized Code. Writing clean code is a top priority while keeping it as optimized as possible.
                        </p>
                    </div>

                </section>

                {/* Projects Section */}
                <section className="space-y-10 py-20 relative max-w-7xl mx-auto">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-cyan-200/50 to-transparent"></div>
                    <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6 px-4">
                        <div className="text-center sm:text-left">
                            <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-2">Featured Work</h2>
                            <p className="text-lg text-slate-500 font-medium">Some of my best projects so far.</p>
                        </div>
                        <Link
                            href="/projects"
                            className="group flex items-center gap-2 text-sm font-bold text-cyan-600 hover:text-cyan-700 transition-all duration-300 bg-white shadow-sm border border-cyan-100 hover:border-cyan-300 hover:shadow-md px-6 py-3 rounded-full uppercase tracking-wider"
                        >
                            View All Projects
                            <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
                        </Link>
                    </div>
                    <div className="mt-8 rounded-[3rem] overflow-hidden bg-white/60 border border-white p-4 sm:p-10 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(6,182,212,0.05)] transition-shadow duration-500">
                        <FeaturedProjects />
                    </div>
                </section>

                {/* Blog Section */}
                <section className="space-y-10 py-20 relative max-w-7xl mx-auto">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-cyan-200/50 to-transparent"></div>
                    <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6 px-4">
                        <div className="text-center sm:text-left">
                            <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-2">Latest Insights</h2>
                            <p className="text-lg text-slate-500 font-medium">Thoughts, learnings, and tutorials.</p>
                        </div>
                        <Link
                            href="/blog"
                            className="group flex items-center gap-2 text-sm font-bold text-cyan-600 hover:text-cyan-700 transition-all duration-300 bg-white shadow-sm border border-cyan-100 hover:border-cyan-300 hover:shadow-md px-6 py-3 rounded-full uppercase tracking-wider"
                        >
                            Read All Articles
                            <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
                        </Link>
                    </div>
                    <div className="mt-8 rounded-[3rem] overflow-hidden bg-white/60 border border-white p-4 sm:p-10 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(6,182,212,0.05)] transition-shadow duration-500">
                        <FeaturedPosts />
                    </div>
                </section>
            </Container>
        </div>
    );
}
