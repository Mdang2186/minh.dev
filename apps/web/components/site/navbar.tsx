"use client";

import { useState, useEffect } from "react";
import { Link, usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { cn } from "@/lib/cn";
import { Menu, X } from "lucide-react";

const navKeys = [
    { href: "/work/projects", key: "projects" },
    { href: "/work/skills-and-tools", key: "skills" },
    { href: "/work/experience", key: "experience" },
    { href: "/work/contact", key: "contact" },
];

export function Navbar() {
    const pathname = usePathname() ?? "";
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);
    const t = useTranslations("Navbar");

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Prevent scroll when sidebar is open
    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [open]);

    return (
        <div className="sticky top-0 z-50 flex justify-center w-full transition-all duration-300">
            <header
                className={cn(
                    "w-full transition-all duration-300 bg-white border-b border-slate-200 dark:bg-slate-950 dark:border-slate-800",
                    scrolled ? "bg-white/95 backdrop-blur-sm" : ""
                )}
            >
                <div className="flex items-center justify-between px-4 py-3 sm:px-6 max-w-7xl mx-auto w-full gap-2">
                    <Link href="/" className="flex items-center gap-2 rounded-full transition-all active:scale-95 group shrink-0">
                        <span className="text-xl sm:text-2xl font-extrabold tracking-tight flex items-center">
                            <span className="text-slate-900 dark:text-white">minh</span>
                            <span className="text-cyan-500 dark:text-cyan-400">dev</span>
                        </span>
                    </Link>

                    <nav className="hidden items-center gap-1 md:flex">
                        {navKeys.map((n) => {
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
                                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-neutral-400 dark:hover:bg-neutral-800/60 dark:hover:text-white"
                                    )}
                                >
                                    {t(n.key)}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="flex items-center gap-3">
                        <LanguageSwitcher />
                        <Link
                            href="/work/contact"
                            className="hidden sm:inline-flex rounded-full bg-slate-800 px-6 py-2.5 text-[14px] font-semibold text-white shadow-sm hover:bg-cyan-500 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 active:scale-95 dark:bg-white dark:text-neutral-900"
                        >
                            {t("talk")}
                        </Link>

                        <button
                            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 transition-colors"
                            onClick={() => setOpen(true)}
                            aria-label="Open menu"
                        >
                            <Menu className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Sidebar */}
            {open && (
                <div 
                    className="fixed inset-0 z-[100] bg-black/60 transition-opacity md:hidden" 
                    onClick={() => setOpen(false)}
                />
            )}

            <div 
                className={cn(
                    "fixed inset-y-0 right-0 z-[110] w-[280px] bg-white dark:bg-slate-950 p-6 shadow-2xl transition-transform duration-300 ease-in-out flex flex-col md:hidden border-l border-slate-200 dark:border-slate-800",
                    open ? "translate-x-0" : "translate-x-full"
                )}
            >
                <div className="flex items-center justify-between mb-8">
                    <span className="text-2xl font-black tracking-tight flex items-center">
                        <span className="text-slate-900 dark:text-white">minh</span>
                        <span className="text-cyan-500 dark:text-cyan-400">dev</span>
                    </span>
                    <button
                        className="inline-flex h-9 w-9 items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
                        onClick={() => setOpen(false)}
                        aria-label="Close menu"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="flex flex-col gap-2 flex-1 overflow-y-auto">
                    {navKeys.map((n) => {
                        const active = pathname === n.href || (n.href !== "/" && pathname.startsWith(n.href));
                        return (
                            <Link
                                key={n.href}
                                href={n.href}
                                onClick={() => setOpen(false)}
                                className={cn(
                                    "block rounded-xl px-4 py-3 text-base font-medium transition-colors hover:bg-slate-100 hover:text-cyan-600 dark:hover:bg-slate-800",
                                    active ? "bg-cyan-50 text-cyan-600 dark:bg-cyan-950/50" : "text-slate-600 dark:text-slate-400"
                                )}
                            >
                                {t(n.key)}
                            </Link>
                        );
                    })}
                </div>
                
                <div className="mt-auto pt-6 flex flex-col gap-4 border-t border-slate-200 dark:border-slate-800">
                    <Link 
                        href="/work/contact" 
                        onClick={() => setOpen(false)}
                        className="w-full flex items-center justify-center rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition-colors dark:bg-white dark:text-slate-900"
                    >
                        {t("talk")}
                    </Link>
                </div>
            </div>
        </div>
    );
}
