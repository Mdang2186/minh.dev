"use client";

import { useLanguage } from "./providers/language-provider";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ className }: { className?: string }) {
  const { language, setLanguage } = useLanguage();

  return (
    <div className={cn("relative inline-block", className)}>
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="appearance-none bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-full px-4 py-2 pr-8 outline-none focus:ring-2 focus:ring-cyan-500 cursor-pointer border border-transparent hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
      >
        <option value="en">English (EN)</option>
        <option value="vi">Tiếng Việt (VI)</option>
        <option value="ja">日本語 (JA)</option>
        <option value="fr">Français (FR)</option>
        <option value="es">Español (ES)</option>
        <option value="zh">中文 (ZH)</option>
        <option value="ko">한국어 (KO)</option>
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
        </svg>
      </div>
    </div>
  );
}
