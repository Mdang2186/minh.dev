"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState, useEffect } from "react";
import { navLinks } from "./nav-links";
import { cn } from "@/lib/utils";
import { Menu, X, Facebook, Github } from "lucide-react";
import { LanguageSwitcher } from "@/components/language-switcher";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const links = useMemo(() => navLinks, []);

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
    <div className="md:hidden">
      <button
        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border bg-background text-sm font-medium hover:bg-muted"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-label="Toggle menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Backdrop */}
      {open && (
        <div 
          className="fixed inset-0 z-[100] bg-black/60 transition-opacity" 
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        className={cn(
          "fixed inset-y-0 right-0 z-[110] w-[280px] bg-background p-6 shadow-2xl transition-transform duration-300 ease-in-out flex flex-col",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between mb-8">
          <span className="text-2xl font-black tracking-tight">
            minh<span className="text-cyan-500">dev</span>
          </span>
          <button
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl hover:bg-muted"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col gap-2 flex-1 overflow-y-auto">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "block rounded-xl px-4 py-3 text-base font-medium transition-colors hover:bg-muted hover:text-cyan-600",
                  active ? "bg-cyan-50 text-cyan-600 dark:bg-cyan-950/50" : "text-muted-foreground"
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </div>
        
        <div className="mt-auto pt-6 flex flex-col gap-4 border-t">
          <div className="flex items-center gap-4 px-2">
            <Link
              href="https://www.facebook.com/"
              target="_blank"
              className="text-muted-foreground transition-colors hover:text-cyan-600"
            >
              <Facebook className="h-5 w-5" />
            </Link>
            <Link
              href="https://github.com/"
              target="_blank"
              className="text-muted-foreground transition-colors hover:text-cyan-600"
            >
              <Github className="h-5 w-5" />
            </Link>
          </div>
          <div className="px-2 pb-2">
            <LanguageSwitcher />
          </div>
          <Link 
            href="/contact" 
            onClick={() => setOpen(false)}
            className="w-full flex items-center justify-center rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition-colors"
          >
            Let's Talk
          </Link>
        </div>
      </div>
    </div>
  );
}
