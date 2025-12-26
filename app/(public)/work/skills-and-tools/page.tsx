import { Container } from "@/components/common/container";
import { PageHeader } from "@/components/common/page-header";
import { skills, tools } from "@/features/work/work.data";
import { TagPill } from "@/components/common/tag-pill";

export default function SkillsToolsPage() {
  return (
    <Container className="py-10">
      <PageHeader title="Skills & Tools" description="Nhóm kỹ năng và công cụ thường dùng." />

      <div className="mt-6 grid gap-6">
        <section className="rounded-2xl border p-5">
          <h3 className="text-base font-semibold">Skills</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {skills.map((s) => (
              <TagPill key={s} label={s} href={`/tag/${encodeURIComponent(s)}`} />
            ))}
          </div>
        </section>

        <section className="rounded-2xl border p-5">
          <h3 className="text-base font-semibold">Tools</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {tools.map((t) => (
              <TagPill key={t} label={t} href={`/tag/${encodeURIComponent(t)}`} />
            ))}
          </div>
        </section>
      </div>
    </Container>
  );
}
