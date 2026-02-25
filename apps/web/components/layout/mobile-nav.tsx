"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { navLinks } from "./nav-links";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const links = useMemo(() => navLinks, []);

  return (
    <div className="sm:hidden">
      <button
        className="inline-flex h-9 items-center justify-center rounded-xl border px-3 text-sm font-medium hover:bg-muted"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Toggle menu"
      >
        Menu
      </button>

      {open ? (
        <div className="mt-2 rounded-2xl border bg-background p-2 shadow-sm">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "block rounded-xl px-3 py-2 text-sm hover:bg-muted",
                  active && "bg-muted font-medium"
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
