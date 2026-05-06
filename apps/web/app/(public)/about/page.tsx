import Link from "next/link";
import { Container } from "@/components/common/container";
import { getPublicSiteProfile, getPublicSocialLinks } from "@/features/portfolio/portfolio.service";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const [profile, socials] = await Promise.all([getPublicSiteProfile(), getPublicSocialLinks()]);

  return (
    <Container className="py-24 md:py-32 max-w-4xl">
      <div className="space-y-16">
        <div className="space-y-6">
          <h1 className="text-4xl font-bold tracking-tighter text-foreground md:text-6xl">
            About Me
          </h1>
          <div className="prose prose-zinc prose-lg max-w-none text-muted-foreground">
            <p>
              Hi, I'm <strong className="text-foreground">{profile.name}</strong>.
            </p>
            <p>{profile.intro}</p>
            <p>{profile.headline}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <h2 className="text-2xl font-bold tracking-tight text-foreground border-b border-border pb-2">Profile</h2>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p><span className="font-semibold text-foreground">Role:</span> {profile.role}</p>
              {profile.location ? <p><span className="font-semibold text-foreground">Location:</span> {profile.location}</p> : null}
              {profile.phone ? <p><span className="font-semibold text-foreground">Phone:</span> {profile.phone}</p> : null}
            </div>
          </div>

          <div className="space-y-8">
            <h2 className="text-2xl font-bold tracking-tight text-foreground border-b border-border pb-2">Connect</h2>
            <div className="grid gap-4">
              {socials.map((social) => (
                <Link
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  className="flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:bg-accent hover:border-accent-foreground/20 transition-all group"
                >
                  <span className="font-medium">{social.name}</span>
                  <span className="text-muted-foreground group-hover:text-foreground">↗</span>
                </Link>
              ))}
              {profile.email ? (
                <Link
                  href={`mailto:${profile.email}`}
                  className="flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:bg-accent hover:border-accent-foreground/20 transition-all group"
                >
                  <span className="font-medium">Email</span>
                  <span className="text-muted-foreground group-hover:text-foreground">✉</span>
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
