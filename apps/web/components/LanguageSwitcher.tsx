"use client";

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { useTransition } from 'react';
import { cn } from '@/lib/cn';
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = e.target.value;
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <div className="relative flex items-center">
      <div className="absolute left-2 text-slate-500 pointer-events-none">
        <Globe className="w-4 h-4" />
      </div>
      <select
        value={locale}
        onChange={handleLanguageChange}
        disabled={isPending}
        className={cn(
          "appearance-none bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800",
          "rounded-full pl-8 pr-8 py-2 text-[14px] font-semibold text-slate-700 dark:text-slate-300",
          "hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer transition-colors outline-none",
          "focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500",
          isPending ? "opacity-50 cursor-not-allowed" : ""
        )}
        aria-label="Select language"
      >
        <option value="en">English</option>
        <option value="vi">Tiếng Việt</option>
        <option value="ja">日本語</option>
        <option value="fr">Français</option>
        <option value="es">Español</option>
        <option value="zh">中文</option>
        <option value="ko">한국어</option>
      </select>
      <div className="pointer-events-none absolute right-3 flex items-center text-slate-500">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
        </svg>
      </div>
    </div>
  );
}
