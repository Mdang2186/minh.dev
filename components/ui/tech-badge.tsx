export const TechBadge = ({ name }: { name: string }) => {
    return (
        <span className="inline-flex items-center rounded-md border border-zinc-200 bg-zinc-50 px-2 py-1 text-xs font-medium text-zinc-600 ring-1 ring-inset ring-zinc-500/10">
            {name}
        </span>
    );
};
