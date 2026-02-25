"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

const items = [
    { href: "/", label: "Home" },
    { href: "/projects", label: "Projects" },
    { href: "/work/skills-and-tools", label: "Skills & Tools" },
    { href: "/work/experience", label: "Experience" },
    { href: "/work/contact", label: "Contact" },
];

export function QuickAccess() {
    const [open, setOpen] = useState(false);
    const [q, setQ] = useState("");
    const pathname = usePathname();

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (typeof e.key === "string" && e.key.toLowerCase() === "q" && !e.metaKey && !e.ctrlKey && !e.altKey) {
                e.preventDefault();
                setOpen((v) => !v);
            }
            if (e.key === "Escape") setOpen(false);
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, []);

    useEffect(() => {
        setOpen(false);
    }, [pathname]);

    const filtered = useMemo(() => {
        const kw = q.trim().toLowerCase();
        if (!kw) return items;
        return items.filter((x) => x.label.toLowerCase().includes(kw));
    }, [q]);

    return (
        <>
            {/* Quick Access Floating Button */}
            <button
                onClick={() => setOpen(true)}
                className="fixed bottom-6 left-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-white shadow-xl transition-transform hover:scale-110 focus:outline-none dark:bg-white dark:text-slate-900"
                aria-label="Quick Access Menu"
            >
                <span className="text-xl font-bold leading-none">⌘</span>
            </button>

            {/* Modal */}
            {open && (
                <div className="fixed inset-0 z-[60]">
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={() => setOpen(false)}
                    />
                    <div className="absolute left-1/2 top-24 w-[92vw] max-w-xl -translate-x-1/2 rounded-2xl border border-neutral-200 bg-white p-4 shadow-2xl dark:border-neutral-800 dark:bg-neutral-950">
                        <div className="flex items-center gap-2">
                            <input
                                autoFocus
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                                placeholder="Search pages... (Type 'Esc' or click outside to close)"
                                className={cn(
                                    "w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition-shadow",
                                    "focus:ring-2 focus:ring-blue-500/50 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100"
                                )}
                            />
                            <button
                                className="rounded-xl px-4 py-3 text-sm font-semibold text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-900 transition-colors"
                                onClick={() => setOpen(false)}
                            >
                                Esc
                            </button>
                        </div>

                        <div className="mt-4 space-y-1">
                            {filtered.map((it) => (
                                <Link
                                    key={it.href}
                                    href={it.href}
                                    onClick={() => setOpen(false)}
                                    className="block rounded-xl px-4 py-3 text-sm font-medium text-neutral-800 hover:bg-blue-50 hover:text-blue-600 transition-colors dark:text-neutral-100 dark:hover:bg-neutral-900"
                                >
                                    {it.label}
                                </Link>
                            ))}
                            {filtered.length === 0 && (
                                <div className="rounded-xl px-4 py-4 text-sm text-neutral-500 dark:text-neutral-400 text-center">
                                    No results found matching "{q}".
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
