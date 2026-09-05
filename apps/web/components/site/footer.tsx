import Link from "next/link";
import { getPublicSiteProfile, getPublicSocialLinks } from "@/features/portfolio/portfolio.service";

export async function Footer() {
  const [profile, socials] = await Promise.all([getPublicSiteProfile(), getPublicSocialLinks()]);

  return (
    <footer className="mt-8 sm:mt-12 border-t border-slate-100 dark:border-slate-800/80 bg-white/40 dark:bg-slate-950/40">
      <div className="py-4 sm:py-5 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-center sm:text-left">
          {/* Brand & Mini Tagline */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-1 group shrink-0">
              <span className="text-base font-extrabold tracking-tight flex items-center">
                <span className="text-slate-900 dark:text-white">minh</span>
                <span className="text-cyan-500 dark:text-cyan-400">dev</span>
              </span>
            </Link>
            <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline truncate max-w-xs">
              {profile.role || "Developer & BA"}
            </span>
          </div>

          {/* Compact Links */}
          <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1.5 text-xs font-medium text-slate-600 dark:text-slate-400">
            <Link className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors" href="/work/projects">
              Projects
            </Link>
            <Link className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors" href="/work/skills-and-tools">
              Skills
            </Link>
            <Link className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors" href="/work/contact">
              Contact
            </Link>
            {socials.map((social) => (
              <Link
                key={social.id}
                className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {social.name}
              </Link>
            ))}
          </div>

          {/* Copyright & Admin */}
          <div className="flex items-center gap-2 text-[11px] text-slate-400 dark:text-slate-500 shrink-0">
            <span>© {new Date().getFullYear()} {profile.name}</span>
            <span>•</span>
            <Link href="/admin/login" className="opacity-50 transition hover:opacity-100 hover:text-cyan-600">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
