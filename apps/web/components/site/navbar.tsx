"use client";

import { useState, useEffect } from "react";
import { Link, usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { cn } from "@/lib/cn";
import { Menu, X } from "lucide-react";

const navKeys = [
    { href: "/work/projects", key: "projects" },
    { href: "/work/experience", key: "experience" },
    { href: "/education", key: "education" },
    { href: "/work/contact", key: "contact" },
];

export function Navbar() {
    const pathname = usePathname() ?? "";
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);
    const t = useTranslations("Navbar");

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Prevent scroll when mobile menu is open
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

    // Close menu on route change
    useEffect(() => {
        setOpen(false);
    }, [pathname]);

    return (
        <>
            {/* FIXED HEADER: ALWAYS VISIBLE ON ALL PAGES */}
            <header
                className={cn(
                    "fixed top-0 left-0 right-0 z-50 w-full h-14 bg-white dark:bg-slate-950 border-b border-slate-200/90 dark:border-slate-800 transition-shadow duration-200",
                    scrolled ? "shadow-sm" : ""
                )}
            >
                <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-full max-w-7xl mx-auto w-full gap-2">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-1.5 rounded-full transition-all active:scale-95 group shrink-0">
                        <span className="text-base sm:text-lg font-black tracking-tight flex items-center">
                            <span className="text-slate-900 dark:text-white">minh</span>
                            <span className="text-cyan-500 dark:text-cyan-400">dev</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden items-center gap-1 md:flex">
                        {navKeys.map((n) => {
                            const active =
                                pathname === n.href || (n.href !== "/" && pathname.startsWith(n.href));
                            return (
                                <Link
                                    key={n.href}
                                    href={n.href}
                                    className={cn(
                                        "relative group px-3.5 py-1.5 text-[13px] font-semibold transition-all duration-200 active:scale-95 rounded-lg",
                                        active
                                            ? "text-cyan-600 dark:text-cyan-400 bg-cyan-50/80 dark:bg-cyan-950/40"
                                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-neutral-400 dark:hover:text-white dark:hover:bg-slate-900"
                                    )}
                                >
                                    {t(n.key)}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Right Controls */}
                    <div className="flex items-center gap-2 sm:gap-2.5">
                        <LanguageSwitcher />
                        <Link
                            href="/work/contact"
                            className="hidden sm:inline-flex rounded-full bg-slate-900 px-4 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-cyan-600 transition-all duration-200 active:scale-95 dark:bg-white dark:text-neutral-900"
                        >
                            {t("talk")}
                        </Link>

                        {/* Hamburger Button */}
                        <button
                            className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-800 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 transition-colors"
                            onClick={() => setOpen(!open)}
                            aria-label={open ? "Close menu" : "Open menu"}
                        >
                            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                        </button>
                    </div>
                </div>

                {/* ── MOBILE MENU: 100% SOLID OPAQUE BACKGROUND, NO BLURRY BLEED-THROUGH ── */}
                <div
                    className={cn(
                        "md:hidden fixed top-14 left-0 right-0 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-2xl transition-all duration-200 ease-out z-50",
                        open
                            ? "opacity-100 translate-y-0 pointer-events-auto visible"
                            : "opacity-0 -translate-y-2 pointer-events-none invisible"
                    )}
                >
                    <div className="px-5 py-4 space-y-1.5 max-w-lg mx-auto bg-white dark:bg-slate-900">
                        {navKeys.map((n) => {
                            const active = pathname === n.href || (n.href !== "/" && pathname.startsWith(n.href));
                            return (
                                <Link
                                    key={n.href}
                                    href={n.href}
                                    onClick={() => setOpen(false)}
                                    className={cn(
                                        "flex items-center justify-between rounded-xl px-4 py-3 text-[15px] font-bold transition-colors",
                                        active
                                            ? "bg-cyan-50 text-cyan-700 dark:bg-cyan-950/70 dark:text-cyan-400"
                                            : "text-slate-800 hover:text-cyan-600 hover:bg-slate-50 dark:text-slate-100 dark:hover:bg-slate-800"
                                    )}
                                >
                                    <span>{t(n.key)}</span>
                                    {active && <span className="w-2 h-2 rounded-full bg-cyan-500" />}
                                </Link>
                            );
                        })}

                        <div className="pt-3 mt-2 border-t border-slate-100 dark:border-slate-800">
                            <Link 
                                href="/work/contact" 
                                onClick={() => setOpen(false)}
                                className="w-full flex items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white hover:bg-cyan-600 transition-colors dark:bg-white dark:text-slate-900 shadow-sm"
                            >
                                {t("talk")}
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Backdrop for click-outside */}
            {open && (
                <div 
                    className="fixed inset-0 top-14 z-40 bg-slate-950/40 md:hidden transition-opacity duration-200" 
                    onClick={() => setOpen(false)}
                />
            )}

            {/* Fixed Navbar Spacer to ensure no page content is hidden underneath */}
            <div className="h-14 shrink-0 w-full" aria-hidden="true" />
        </>
    );
}
