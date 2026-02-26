import Link from "next/link";
import { siteConfig } from "@/features/site/site.config";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card py-16 mt-24">
      <div className="container mx-auto max-w-screen-xl px-4">
        <div className="grid gap-12 md:grid-cols-4">
          {/* About Section */}
          <div className="space-y-4 md:col-span-2">
            <Link href="/" className="text-xl font-bold tracking-tight">
              {siteConfig.author.name}
            </Link>
            <p className="max-w-md text-sm text-muted-foreground leading-relaxed">
              I'm {siteConfig.author.name}, passionate Fullstack Developer focused on building efficient, optimized, and scalable applications.
            </p>
          </div>

          {/* Work Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Work</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/work/contact" className="hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/work/experience" className="hover:text-foreground transition-colors">
                  Experience
                </Link>
              </li>
              <li>
                <Link href="/work/skills-and-tools" className="hover:text-foreground transition-colors">
                  Skills and Tools
                </Link>
              </li>
            </ul>
          </div>

          {/* Learn Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Learn</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/blog" className="hover:text-foreground transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/work/projects" className="hover:text-foreground transition-colors">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-foreground transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} {siteConfig.author.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
