import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost";

export function Button({
    href,
    children,
    variant = "primary",
    className,
    target,
}: {
    href: string;
    children: React.ReactNode;
    variant?: Variant;
    className?: string;
    target?: string;
}) {
    const base =
        "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400/60 dark:focus-visible:ring-neutral-600/60";
    const styles: Record<Variant, string> = {
        primary:
            "bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200",
        secondary:
            "border border-neutral-200 bg-white text-neutral-900 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100 dark:hover:bg-neutral-900",
        ghost:
            "text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-900",
    };

    return (
        <Link href={href} target={target} className={cn(base, styles[variant], className)}>
            {children}
        </Link>
    );
}
