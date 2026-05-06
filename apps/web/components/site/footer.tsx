import Link from "next/link";
import { Container } from "@/components/ui/container";
import { getPublicSiteProfile, getPublicSocialLinks } from "@/features/portfolio/portfolio.service";

export async function Footer() {
  const [profile, socials] = await Promise.all([getPublicSiteProfile(), getPublicSocialLinks()]);

  return (
    <footer className="mt-20 border-t border-neutral-100 dark:border-neutral-800/60 bg-white/50 dark:bg-neutral-950/50">
      <Container className="py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="flex flex-col gap-3">
            <Link href="/" className="flex items-center gap-2 w-fit group">
              <span className="text-2xl font-extrabold tracking-tight flex items-center">
                <span className="text-slate-900 dark:text-white">minh</span>
                <span className="text-cyan-500 dark:text-cyan-400">dev</span>
              </span>
            </Link>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-sm">
              {profile.role}
              {profile.location ? ` based in ${profile.location}.` : "."} Building clean, modern UI with solid UX.
            </p>
          </div>

          <div className="flex items-center flex-wrap gap-5 text-sm font-semibold">
            <Link className="text-neutral-600 hover:text-cyan-600 dark:text-neutral-400 dark:hover:text-cyan-400 transition-colors" href="/work/projects">
              Projects
            </Link>
            <Link className="text-neutral-600 hover:text-cyan-600 dark:text-neutral-400 dark:hover:text-cyan-400 transition-colors" href="/work/skills-and-tools">
              Skills
            </Link>
            <Link className="text-neutral-600 hover:text-cyan-600 dark:text-neutral-400 dark:hover:text-cyan-400 transition-colors" href="/work/contact">
              Contact
            </Link>
            {socials.length ? <div className="w-px h-4 bg-neutral-300 dark:bg-neutral-700 hidden sm:block" /> : null}
            {socials.map((social) => (
              <Link
                key={social.id}
                className="text-neutral-600 hover:text-cyan-600 dark:text-neutral-400 dark:hover:text-cyan-400 transition-colors"
                href={social.url}
                target="_blank"
              >
                {social.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-neutral-200/50 dark:border-neutral-800/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-neutral-400 dark:text-neutral-500">
          <p>© {new Date().getFullYear()} {profile.name}. All rights reserved.</p>
          <Link href="/admin/login" className="text-[11px] opacity-50 transition hover:opacity-100 hover:text-cyan-600">
            Admin
          </Link>
        </div>
      </Container>
    </footer>
  );
}
