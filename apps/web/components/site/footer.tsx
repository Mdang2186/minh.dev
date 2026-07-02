import Link from "next/link";
import { Container } from "@/components/ui/container";
import { getPublicSiteProfile, getPublicSocialLinks } from "@/features/portfolio/portfolio.service";

export async function Footer() {
  const [profile, socials] = await Promise.all([getPublicSiteProfile(), getPublicSocialLinks()]);

  return (
    <footer className="mt-16 border-t border-neutral-100 dark:border-neutral-800/60 bg-white/50 dark:bg-neutral-950/50">
      <Container className="py-10">
        <div className="flex flex-col items-center justify-center text-center gap-6">
          <Link href="/" className="flex items-center gap-1.5 w-fit group">
            <span className="text-xl font-extrabold tracking-tight flex items-center">
              <span className="text-slate-900 dark:text-white">minh</span>
              <span className="text-cyan-500 dark:text-cyan-400">dev</span>
            </span>
          </Link>

          <p className="text-[13px] text-neutral-500 dark:text-neutral-400 max-w-md mx-auto leading-relaxed">
            {profile.role}
            {profile.location ? ` based in ${profile.location}.` : "."} Building clean, modern UI with solid UX.
          </p>
          
          <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-3 text-[13px] font-medium">
            <Link className="text-neutral-600 hover:text-cyan-600 dark:text-neutral-400 dark:hover:text-cyan-400 transition-colors" href="/work/projects">
              Projects
            </Link>
            <Link className="text-neutral-600 hover:text-cyan-600 dark:text-neutral-400 dark:hover:text-cyan-400 transition-colors" href="/work/skills-and-tools">
              Skills
            </Link>
            <Link className="text-neutral-600 hover:text-cyan-600 dark:text-neutral-400 dark:hover:text-cyan-400 transition-colors" href="/work/contact">
              Contact
            </Link>
            {socials.length ? <div className="w-1 h-1 rounded-full bg-neutral-300 dark:bg-neutral-700 hidden sm:block" /> : null}
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

        <div className="mt-8 pt-6 border-t border-neutral-200/50 dark:border-neutral-800/50 flex flex-col sm:flex-row items-center justify-center gap-3 text-[12px] text-neutral-400 dark:text-neutral-500">
          <p>© {new Date().getFullYear()} {profile.name}. All rights reserved.</p>
          <span className="hidden sm:inline text-neutral-300 dark:text-neutral-700">•</span>
          <Link href="/admin/login" className="opacity-50 transition hover:opacity-100 hover:text-cyan-600">
            Admin
          </Link>
        </div>
      </Container>
    </footer>
  );
}
