export function PageHeader({ title, description }: { title: string; description?: string }) {
  return (
    <header>
      <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
      {description ? <p className="mt-3 text-sm text-muted-foreground">{description}</p> : null}
    </header>
  );
}
