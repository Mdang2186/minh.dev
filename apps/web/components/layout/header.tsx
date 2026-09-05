"use client";

import Link from "next/link";
import { siteConfig } from "@/features/site/site.config";
import { navLinks } from "./nav-links";
import { MobileNav } from "./mobile-nav";
import { Github, Facebook } from "lucide-react";
import { LanguageSwitcher } from "@/components/language-switcher";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="container mx-auto flex h-16 max-w-screen-xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="text-2xl font-black tracking-tight hover:opacity-80 transition-opacity">
          minh<span className="text-cyan-500">dev</span>
        </Link>

        {/* Center Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative group text-sm font-bold text-muted-foreground transition-colors hover:text-foreground py-2"
            >
              {link.label}
              <span className="absolute left-0 bottom-0 w-full h-[2px] bg-cyan-500 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-out rounded-full" />
            </Link>
          ))}
        </nav>

        {/* Right Side: Social Icons */}
        <div className="flex items-center gap-4">
          <Link
            href="https://www.facebook.com/"
            target="_blank"
            className="hidden text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
          >
            <Facebook className="h-5 w-5" />
          </Link>
          <Link
            href="https://github.com/"
            target="_blank"
            className="hidden text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
          >
            <Github className="h-5 w-5" />
          </Link>
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
