import { Container } from "@/components/common/container";

export default function LoadingProject() {
  return (
    <Container className="py-10">
      <div className="h-7 w-64 animate-pulse rounded bg-muted" />
      <div className="mt-3 h-4 w-96 animate-pulse rounded bg-muted" />
      <div className="mt-8 grid gap-3">
        <div className="h-4 w-full animate-pulse rounded bg-muted" />
        <div className="h-4 w-11/12 animate-pulse rounded bg-muted" />
        <div className="h-4 w-10/12 animate-pulse rounded bg-muted" />
      </div>
    </Container>
  );
}
