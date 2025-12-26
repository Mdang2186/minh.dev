import Link from "next/link";

import { cn } from "@/lib/utils";

interface TagPillProps {
  label: string;
  href: string;
  className?: string;
}

export function TagPill({ label, href, className }: TagPillProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground",
        className
      )}
    >
      {label}
    </Link>
  );
}
