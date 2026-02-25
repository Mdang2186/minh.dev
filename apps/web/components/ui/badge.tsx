import { cn } from "@/lib/cn";

export function Badge({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <span
            className={cn(
                "inline-flex items-center rounded-full border border-neutral-200/70 bg-white/60 px-2.5 py-1 text-xs font-medium text-neutral-700 backdrop-blur",
                "dark:border-neutral-800/70 dark:bg-neutral-950/40 dark:text-neutral-200",
                className
            )}
        >
            {children}
        </span>
    );
}
