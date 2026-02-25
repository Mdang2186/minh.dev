import { Container } from "@/components/common/container";
import { PageHeader } from "@/components/common/page-header";
import { experiences, educations, certifications } from "@/features/work/work.data";
import { Briefcase, GraduationCap, Award, Calendar, MapPin } from "lucide-react";
import Link from "next/link";

export default function ExperiencePage() {
  return (
    <Container className="py-16 md:py-24">
      <div className="mx-auto max-w-4xl space-y-20">

        {/* Experience Section */}
        <section className="space-y-12">
          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl flex items-center gap-4 text-foreground">
              <span className="p-3 bg-primary/10 rounded-2xl text-primary">
                <Briefcase className="h-8 w-8" />
              </span>
              Experience
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
              My professional journey, roles, and responsibilities in software development.
            </p>
          </div>

          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-[2px] before:bg-gradient-to-b before:from-border/0 before:via-border/60 before:to-border/0">
            {experiences.map((exp) => (
              <div key={exp.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-[3px] border-background bg-zinc-100 dark:bg-zinc-800 text-zinc-500 shadow-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                  <Briefcase size={16} />
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-7 rounded-3xl border border-border/50 bg-card/50 backdrop-blur-sm text-card-foreground shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300">
                  <div className="flex flex-col space-y-2 pb-5 border-b border-border/40 mb-5">
                    <h3 className="text-2xl font-bold tracking-tight text-foreground">{exp.title}</h3>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-sm text-muted-foreground font-medium pt-1">
                      <span className="flex items-center gap-1.5"><MapPin size={16} className="text-primary/70" /> {exp.org}</span>
                      <span className="hidden sm:inline text-border">•</span>
                      <span className="flex items-center gap-1.5"><Calendar size={16} className="text-primary/70" /> {exp.period}</span>
                    </div>
                  </div>
                  <ul className="space-y-3 text-[15px] leading-relaxed text-muted-foreground/90 list-none">
                    {exp.highlights.map((h, i) => (
                      <li key={i} className="relative pl-5 before:absolute before:left-0 before:top-2 before:h-1.5 before:w-1.5 before:rounded-full before:bg-primary/50">
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Education Section */}
        <section className="space-y-12">
          <div className="space-y-4 pt-4 border-t border-border/40">
            <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl flex items-center gap-3 pt-8 text-foreground">
              <span className="p-2.5 bg-primary/10 rounded-2xl text-primary">
                <GraduationCap className="h-7 w-7" />
              </span>
              Education & Certifications
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
              Detailed overview of my academic background and professional certifications.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 items-stretch">
            <div className="space-y-6 flex flex-col">
              <h3 className="text-2xl font-bold flex items-center gap-2.5 pb-2 text-foreground/90">
                <GraduationCap className="h-6 w-6 text-primary/80" /> Education
              </h3>
              <div className="space-y-6 flex-1 flex flex-col">
                {educations.map((edu) => (
                  <div key={edu.id} className="p-7 rounded-3xl border border-border/50 bg-card/50 backdrop-blur-sm space-y-5 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300 h-full">
                    <div>
                      <h4 className="font-bold text-xl text-foreground">{edu.title}</h4>
                      <div className="flex flex-col gap-1.5 mt-3">
                        <p className="text-[15px] font-medium text-muted-foreground flex items-center gap-2">
                          <MapPin size={16} className="text-primary/70 shrink-0" /> {edu.org}
                        </p>
                        <p className="text-[15px] font-medium text-muted-foreground flex items-center gap-2">
                          <Calendar size={16} className="text-primary/70 shrink-0" /> {edu.period}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2.5 text-[15px] bg-muted/40 p-5 rounded-2xl border border-border/30">
                      <div className="flex justify-between border-b border-border/50 pb-2.5">
                        <span className="text-muted-foreground">Major</span>
                        <span className="font-semibold text-foreground text-right">{edu.major}</span>
                      </div>
                      <div className="flex justify-between border-b border-border/50 pb-2.5">
                        <span className="text-muted-foreground">Degree</span>
                        <span className="font-semibold text-foreground text-right">{edu.degree}</span>
                      </div>
                      <div className="flex justify-between pt-1">
                        <span className="text-muted-foreground">GPA</span>
                        <span className="font-bold text-primary text-right">{edu.gpa}</span>
                      </div>
                    </div>
                    {edu.description && (
                      <p className="text-[15px] leading-relaxed text-muted-foreground/90 pt-1">
                        {edu.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6 flex flex-col">
              <h3 className="text-2xl font-bold flex items-center gap-2.5 pb-2 text-foreground/90">
                <Award className="h-6 w-6 text-primary/80" /> Certifications
              </h3>
              <div className="space-y-5 flex-1 flex flex-col">
                {certifications.map((cert) => (
                  <div key={cert.id} className="p-7 rounded-3xl border border-border/50 bg-card/50 backdrop-blur-sm flex flex-col justify-between hover:shadow-md hover:border-primary/30 transition-all duration-300 shadow-sm h-full">
                    <div className="space-y-4">
                      <h4 className="font-bold text-lg leading-snug text-foreground">{cert.title}</h4>
                      <div className="text-[15px] font-medium text-muted-foreground flex flex-col gap-2.5">
                        <span className="flex items-center gap-2 text-foreground/90">
                          <Award size={16} className="text-primary/70 shrink-0" /> {cert.issuer}
                        </span>
                        <span className="flex items-center gap-2">
                          <Calendar size={16} className="text-primary/70 shrink-0" /> {cert.date}
                        </span>
                      </div>
                    </div>
                    {cert.url && cert.url !== "#" && (
                      <div className="mt-7 pt-5 border-t border-border/40">
                        <Link href={cert.url} target="_blank" className="text-[15px] text-primary hover:text-primary/80 hover:underline inline-flex items-center gap-1.5 font-semibold transition-colors">
                          View Credential <span className="text-lg leading-none">↗</span>
                        </Link>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

      </div>
    </Container>
  );
}
