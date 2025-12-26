"use client";

import Link from "next/link";
import { Post } from "@/features/blog/blog.types";
import { ArrowUpRight } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

export function BlogCard({ post }: { post: Post }) {
    return (
        <Link href={`/blog/${post.slug}`} className="group relative block w-full border-b border-zinc-200 py-12 transition-colors hover:bg-zinc-50/50">
            <div className="flex flex-col md:flex-row gap-8 items-baseline">
                {/* Date */}
                <div className="md:w-1/4">
                    <span className="text-zinc-400 font-bold text-sm tracking-widest uppercase">
                        {format(new Date(post.publishedAt), "dd MMM yyyy", { locale: vi })}
                    </span>
                </div>

                {/* Content */}
                <div className="flex-1">
                    <div className="flex items-center justify-between gap-4">
                        <h2 className="text-3xl md:text-5xl font-black text-zinc-900 leading-tight uppercase tracking-tight group-hover:text-blue-600 transition-colors">
                            {post.title}
                        </h2>
                        <ArrowUpRight className="h-8 w-8 text-zinc-300 group-hover:text-blue-600 transition-colors transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </div>

                    <p className="mt-4 text-xl text-zinc-500 font-medium max-w-2xl">
                        {post.description}
                    </p>

                    <div className="mt-6 flex gap-2">
                        {post.tags?.map(tag => (
                            <span key={tag} className="inline-block px-3 py-1 rounded-full border border-zinc-200 text-xs font-bold text-zinc-400 uppercase tracking-wider bg-white">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </Link>
    );
}
