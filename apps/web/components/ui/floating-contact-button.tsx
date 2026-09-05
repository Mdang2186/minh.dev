"use client";

import { usePathname } from "@/i18n/routing";
import { Link } from "@/i18n/routing";
import { useLocale } from "next-intl";
import { MessageCircle, X } from "lucide-react";
import { useState } from "react";

export function FloatingContactButton() {
  const pathname = usePathname();
  const locale = useLocale();
  const [dismissTooltip, setDismissTooltip] = useState(false);

  // Hide when already on contact page
  const isContactPage = pathname.includes("/work/contact") || pathname === "/contact";

  if (isContactPage) {
    return null;
  }

  const tooltipText = locale === "vi" ? "Nhắn tin nhanh" : "Let's Talk";

  return (
    <div className="fixed bottom-20 left-4 sm:bottom-8 sm:left-8 z-40 flex items-center gap-2.5 select-none font-sans">
      {/* Circular floating action button with pulse badge (matching user reference) */}
      <Link
        href="/work/contact"
        className="group relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/35 hover:shadow-cyan-500/55 hover:scale-105 active:scale-95 transition-all duration-300 shrink-0"
        aria-label="Contact / Let's Talk"
      >
        {/* Glow pulse ring behind */}
        <span className="absolute inset-0 rounded-full bg-cyan-400 opacity-30 group-hover:opacity-60 animate-ping pointer-events-none" />

        {/* Message Icon */}
        <MessageCircle className="w-5 h-5 sm:w-5.5 sm:h-5.5 stroke-[2] drop-shadow-sm group-hover:rotate-6 transition-transform" />

        {/* Red notification badge (1) */}
        <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-slate-950">
          1
        </span>
      </Link>

      {/* Speech bubble tooltip on the right with pointer arrow pointing left (Image 2 style) */}
      {!dismissTooltip && (
        <div className="relative flex items-center bg-white dark:bg-slate-900 text-slate-800 dark:text-white pl-3 pr-2.5 py-1.5 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-800 text-xs font-semibold tracking-tight transition-all duration-300 animate-in fade-in slide-in-from-left-2">
          {/* Arrow pointer pointing left towards the circular button */}
          <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white dark:bg-slate-900 rotate-45 border-b border-l border-slate-100 dark:border-slate-800" />
          <Link href="/work/contact" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors whitespace-nowrap">
            {tooltipText}
          </Link>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setDismissTooltip(true);
            }}
            className="ml-2 p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full transition-colors"
            aria-label="Dismiss tooltip"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
}
