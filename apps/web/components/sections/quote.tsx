import { useTranslations } from "next-intl";
import { Quote as QuoteIcon } from "lucide-react";

export function Quote() {
    const t = useTranslations("Quote");
    
    return (
        <section className="py-10 md:py-16 relative w-full flex justify-center items-center px-6">
            <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
                <QuoteIcon className="w-12 h-12 md:w-16 md:h-16 text-slate-300 dark:text-slate-700 mb-8 opacity-80" />
                
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-medium text-slate-400 dark:text-slate-500 leading-[1.5] md:leading-[1.4] tracking-tight">
                    <span className="font-extrabold text-slate-800 dark:text-white">{t("line1_1")}</span> {t("line1_2")} {t("line2_1")}{" "}
                    <span className="font-extrabold text-slate-800 dark:text-white">{t("line2_2")}</span>{" "}
                    {t("line2_3")}{" "}
                    <span className="font-extrabold text-slate-800 dark:text-white">{t("line2_4")}</span>
                    <br className="hidden lg:block" />{" "}
                    <span className="font-extrabold text-slate-800 dark:text-white">{t("line1_1")}</span> {t("line3_1")}{" "}
                    <span className="inline-block px-5 py-2 md:px-8 md:py-3 mt-4 md:mt-0 bg-slate-800 dark:bg-slate-100 text-white dark:text-slate-900 font-extrabold rounded-2xl shadow-[4px_4px_15px_rgba(0,0,0,0.1)] transform md:-rotate-2 border border-slate-700/50 dark:border-white/50">
                        {t("line3_2")}
                    </span>
                </h2>
                
                <div className="mt-14 flex items-center justify-center gap-4 text-slate-400 font-bold tracking-widest uppercase text-sm md:text-base">
                    <div className="w-12 md:w-20 h-px bg-slate-200 dark:bg-slate-800"></div>
                    {t("author")}
                    <div className="w-12 md:w-20 h-px bg-slate-200 dark:bg-slate-800"></div>
                </div>
            </div>
        </section>
    );
}
