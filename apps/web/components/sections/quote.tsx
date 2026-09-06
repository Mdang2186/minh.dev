import { useTranslations } from "next-intl";
import { Quote as QuoteIcon } from "lucide-react";

export function Quote() {
    const t = useTranslations("Quote");
    
    return (
        <section className="py-8 md:py-12 relative w-full flex justify-center items-center px-6">
            <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
                <QuoteIcon className="w-8 h-8 md:w-12 md:h-12 text-slate-300 dark:text-slate-700 mb-4 opacity-80" />
                
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[46px] font-medium text-slate-400 dark:text-slate-500 leading-[1.6] md:leading-[1.7] tracking-tight">
                    <span className="font-extrabold text-slate-800 dark:text-white">{t("line1_1")}</span> {t("line1_2")} {t("line2_1")}{" "}
                    <span className="font-extrabold text-blue-600 dark:text-blue-400">{t("line2_2")}</span>{" "}
                    {t("line2_3")}{" "}
                    <span className="font-extrabold text-slate-800 dark:text-white">{t("line2_4")}</span>
                    <br className="hidden lg:block" />{" "}
                    <span className="font-extrabold text-slate-800 dark:text-white">{t("line1_1")}</span> {t("line3_1")}{" "}
                    <span className="inline-block px-4 py-1.5 md:px-6 md:py-2 mt-4 md:mt-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 text-white font-extrabold rounded-xl transform md:-rotate-2 text-xl sm:text-2xl md:text-3xl">
                        {t("line3_2")}
                    </span>
                </h2>
                
                <div className="mt-6 flex items-center justify-center gap-4 text-slate-400 font-bold tracking-widest uppercase text-xs md:text-sm">
                    <div className="w-10 md:w-16 h-px bg-slate-200 dark:bg-slate-800"></div>
                    {t("author")}
                    <div className="w-10 md:w-16 h-px bg-slate-200 dark:bg-slate-800"></div>
                </div>
            </div>
        </section>
    );
}
