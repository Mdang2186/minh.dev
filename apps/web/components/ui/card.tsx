import { cn } from "@/lib/cn";

export function Card({
    className,
    children,
}: {
    className?: string;
    children: React.ReactNode;
}) {
    return (
        <div
            className={cn(
                "rounded-2xl border border-neutral-200/70 bg-white/70 p-5 shadow-sm backdrop-blur",
                "dark:border-neutral-800/70 dark:bg-neutral-950/40",
                className
            )}
        >
            {children}
        </div>
    );
}

export function CardTitle({ className, children }: { className?: string; children: React.ReactNode }) {
    return (
        <div className={cn("text-base font-semibold text-neutral-900 dark:text-neutral-100", className)}>
            {children}
        </div>
    );
}

export function CardDesc({ className, children }: { className?: string; children: React.ReactNode }) {
    return (
        <div className={cn("mt-1 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300", className)}>
            {children}
        </div>
    );
}
