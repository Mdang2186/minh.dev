import { Container } from "@/components/common/container";
import { PageHeader } from "@/components/common/page-header";
import { experiences } from "@/features/work/work.data";

export default function ExperiencePage() {
  return (
    <Container className="py-10">
      <PageHeader
        title="Experience"
        description="Kinh nghiệm theo thời gian, ưu tiên kết quả và vai trò."
      />

      <div className="mt-6 grid gap-4">
        {experiences.map((e) => (
          <div key={e.id} className="rounded-2xl border p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-base font-semibold">{e.title}</h3>
              <span className="text-sm text-muted-foreground">{e.period}</span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{e.org}</p>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm">
              {e.highlights.map((h, idx) => (
                <li key={idx}>{h}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Container>
  );
}
