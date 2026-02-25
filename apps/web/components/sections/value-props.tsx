import { Container } from "@/components/ui/container";
import { Card, CardDesc, CardTitle } from "@/components/ui/card";

const items = [
    {
        title: "Clean & Intuitive",
        desc: "Minimal, modern UI without compromising UX. Strong typography, spacing, and consistency.",
    },
    {
        title: "Detail Oriented",
        desc: "I care about small details: accessibility, alignment, edge cases, and user flow clarity.",
    },
    {
        title: "Pretty & Optimized",
        desc: "Readable code, practical components, and performance-aware UI implementation.",
    },
];

export function ValueProps() {
    return (
        <section className="mt-10">
            <Container>
                <div className="grid gap-4 md:grid-cols-3">
                    {items.map((it) => (
                        <Card key={it.title}>
                            <CardTitle>{it.title}</CardTitle>
                            <CardDesc>{it.desc}</CardDesc>
                        </Card>
                    ))}
                </div>
            </Container>
        </section>
    );
}
