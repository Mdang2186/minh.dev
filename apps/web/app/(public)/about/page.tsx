import { Container } from "@/components/common/container";
import { siteConfig } from "@/features/site/site.config";
import Link from "next/link";

export default function AboutPage() {
    return (
        <Container className="py-24 md:py-32 max-w-4xl">
            <div className="space-y-16">
                {/* Intro */}
                <div className="space-y-6">
                    <h1 className="text-4xl font-bold tracking-tighter text-foreground md:text-6xl">
                        About Me
                    </h1>
                    <div className="prose prose-zinc prose-lg max-w-none text-muted-foreground">
                        <p>
                            Hi, I'm <strong className="text-foreground">{siteConfig.author.name}</strong>. I am a software engineer based in Vietnam with a focus on building accessible, high-performance web applications.
                        </p>
                        <p>
                            My journey started with a curiosity for how things work on the internet, which led me to dive deep into the JavaScript ecosystem. Today, I specialize in <strong className="text-foreground">Next.js</strong>, <strong className="text-foreground">React</strong>, and <strong className="text-foreground">TypeScript</strong>.
                        </p>
                        <p>
                            I believe in the power of minimalism and clarity in design and code. When I'm not coding, I'm likely reading about new technologies or exploring local coffee shops.
                        </p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-12">
                    {/* Experience Section */}
                    <div className="space-y-8">
                        <h2 className="text-2xl font-bold tracking-tight text-foreground border-b border-border pb-2">Experience</h2>
                        <div className="space-y-10">
                            {/* Experience Item */}
                            <div className="relative pl-6 border-l-2 border-border/50">
                                <span className="absolute -left-[5px] top-2 h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-background" />
                                <div className="space-y-1">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                        <h3 className="text-lg font-semibold text-foreground">Frontend Developer</h3>
                                        <span className="text-sm font-medium text-muted-foreground font-mono">2023 - Present</span>
                                    </div>
                                    <div className="text-base font-medium text-foreground/80">Freelance</div>
                                    <p className="text-sm text-muted-foreground pt-1">
                                        Building performant web applications and landing pages for various clients using modern stack.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Connect Section */}
                    <div className="space-y-8">
                        <h2 className="text-2xl font-bold tracking-tight text-foreground border-b border-border pb-2">Connect</h2>
                        <div className="grid gap-4">
                            {siteConfig.socials.map(social => (
                                <Link
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    className="flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:bg-accent hover:border-accent-foreground/20 transition-all group"
                                >
                                    <span className="font-medium">{social.label}</span>
                                    <span className="text-muted-foreground group-hover:text-foreground">↗</span>
                                </Link>
                            ))}
                            <Link
                                href={`mailto:${siteConfig.contact.email}`}
                                className="flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:bg-accent hover:border-accent-foreground/20 transition-all group"
                            >
                                <span className="font-medium">Email</span>
                                <span className="text-muted-foreground group-hover:text-foreground">✉</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    );
}
