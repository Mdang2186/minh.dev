"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

const nav: { href: string; label: string }[] = [
    { href: "/work/projects", label: "Projects" },
    { href: "/work/skills-and-tools", label: "Skills & Tools" },
    { href: "/work/experience", label: "Experience & Edu" },
    { href: "/work/contact", label: "Contact" },
];

export function Navbar() {
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="sticky top-6 z-50 flex justify-center px-4 mb-6 pointer-events-none transition-all duration-300">
            <header
                className={cn(
                    "pointer-events-auto rounded-[2.5rem] transition-all duration-500 w-full max-w-5xl",
                    scrolled
                        ? "bg-white/[0.05] backdrop-blur-[20px] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1),inset_0_2px_4px_rgba(255,255,255,0.8),inset_0_-2px_4px_rgba(0,0,0,0.05)] ring-1 ring-white/30 dark:bg-black/10 dark:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3),inset_0_2px_4px_rgba(255,255,255,0.2),inset_0_-2px_4px_rgba(255,255,255,0.02)] dark:ring-white/10"
                        : "bg-transparent backdrop-blur-none shadow-none ring-0"
                )}
            >
                <div className="flex items-center justify-between px-3 py-2 sm:px-3 gap-2 sm:gap-6">
                    <Link href="/" className="flex items-center gap-2 px-3 py-2 rounded-full transition-all active:scale-95 group">
                        <span className="text-xl font-extrabold tracking-tight flex items-center">
                            <span className="text-slate-900 dark:text-white">minh</span>
                            <span className="text-cyan-500 dark:text-cyan-400">dev</span>
                        </span>
                    </Link>

                    <nav className="hidden items-center gap-1 md:flex">
                        {nav.map((n) => {
                            const active =
                                pathname === n.href || (n.href !== "/" && pathname.startsWith(n.href));
                            return (
                                <Link
                                    key={n.href}
                                    href={n.href}
                                    className={cn(
                                        "rounded-full px-4 py-2 text-[14px] font-semibold transition-all duration-300 active:scale-95",
                                        active
                                            ? "bg-cyan-100/50 text-cyan-700 shadow-sm dark:bg-cyan-950/50 dark:text-cyan-400"
                                            : "text-slate-600 hover:bg-white/60 hover:text-slate-900 dark:text-neutral-400 dark:hover:bg-neutral-800/60 dark:hover:text-white"
                                    )}
                                >
                                    {n.label}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="flex items-center gap-2 pl-1">
                        <Link
                            href="/work/contact"
                            className="rounded-full bg-slate-800 px-6 py-2.5 text-[14px] font-semibold text-white shadow-[0_2px_10px_rgb(0,0,0,0.1)] hover:bg-cyan-500 hover:shadow-[0_4px_15px_rgb(6,182,212,0.3)] hover:-translate-y-0.5 transition-all duration-300 active:scale-95 dark:bg-white dark:text-neutral-900"
                        >
                            Let's Talk
                        </Link>
                    </div>
                </div>
            </header>
        </div>
    );
}
