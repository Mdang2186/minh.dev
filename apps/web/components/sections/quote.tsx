import { useTranslations } from "next-intl";

export function Quote() {
    const t = useTranslations("Quote");
    return (
        <section className="py-8 md:py-10 flex justify-center items-center px-0 md:px-4 relative w-[100vw] left-[50%] right-[50%] -ml-[50vw] -mr-[50vw] bg-white overflow-hidden">
            
            {/* Horizontal Background Line - extending full viewport width */}
            <div className="absolute top-[48%] md:top-[50%] left-0 w-full h-[16px] md:h-[40px] bg-[#eef2f6] z-0"></div>

            {/* Central block with white background to mask the line automatically sizes to content */}
            <div className="flex flex-col items-center md:items-start relative z-10 bg-white px-4 md:px-24 py-4">

                {/* Top Right Quote Marks */}
                <div className="absolute top-2 md:top-8 right-6 md:right-24 flex space-x-[6px] md:space-x-[10px] z-10">
                    <div className="w-[12px] md:w-[24px] h-[28px] md:h-[56px] bg-[#64748b] skew-x-[-22deg]"></div>
                    <div className="w-[12px] md:w-[24px] h-[28px] md:h-[56px] bg-[#64748b] skew-x-[-22deg]"></div>
                </div>

                {/* Line 1 */}
                <div className="flex flex-row md:items-baseline items-center gap-2 md:gap-8 justify-center md:justify-start flex-nowrap whitespace-nowrap pr-8 md:pr-40">
                    <h2 className="text-[50px] sm:text-[65px] md:text-[140px] italic font-black text-[#475569] leading-none tracking-normal [text-shadow:2px_2px_0px_#cbd5e1,4px_4px_0px_#f1f5f9] md:[text-shadow:4px_4px_0px_#cbd5e1,8px_8px_0px_#f1f5f9]" 
                        style={{ fontFamily: "'RoxboroughCF', serif" }}>
                        {t("line1_1")}
                    </h2>
                    <span className="text-base sm:text-lg md:text-[30px] text-[#64748b] italic font-medium pb-0 md:pb-4 tracking-wide">
                        {t("line1_2")}
                    </span>
                </div>

                {/* Line 2 */}
                <div className="flex flex-row items-baseline justify-center md:justify-start gap-1 md:gap-3 mt-2 md:mt-2 md:pl-[380px] flex-nowrap whitespace-nowrap">
                    <span className="text-base sm:text-lg md:text-[30px] font-light text-[#94a3b8] tracking-wide">{t("line2_1")}</span>
                    <span className="text-xl sm:text-2xl md:text-[50px] font-extrabold text-[#475569] tracking-normal">
                        {t("line2_2")} 
                    </span>
                    <span className="text-base sm:text-lg md:text-[30px] font-light italic text-[#94a3b8] tracking-wide px-1 md:px-2">{t("line2_3")}</span> 
                    <span className="text-xl sm:text-2xl md:text-[50px] font-extrabold text-[#475569] tracking-normal">
                        {t("line2_4")}
                    </span>
                </div>

                {/* Line 3 with long line and pill */}
                <div className="flex flex-row items-center justify-center md:justify-start gap-2 md:gap-6 mt-4 md:mt-6 md:pl-[140px] flex-nowrap whitespace-nowrap">
                    {/* Long horizontal line before "is" */}
                    <div className="hidden md:block w-[30px] md:w-[100px] h-[2px] bg-[#cbd5e1]"></div>

                    <div className="flex flex-row items-center justify-center gap-2 md:gap-4 flex-nowrap whitespace-nowrap">
                        <span className="text-lg sm:text-xl md:text-[34px] font-light text-[#94a3b8] tracking-wide">{t("line3_1")}</span>
                        <span className="text-xl sm:text-2xl md:text-[50px] italic font-extrabold text-[#334155] bg-[#eef2f6] px-5 md:px-14 py-2 md:py-4 rounded-full md:rounded-[1.5rem] tracking-normal">
                            {t("line3_2")}
                        </span>
                    </div>
                </div>

                {/* Author */}
                <div className="mt-8 md:mt-12 text-sm md:text-xl text-[#64748b] font-bold self-center md:self-end flex items-center gap-2 md:gap-4 pr-0 md:pr-12 w-full justify-center md:justify-end">
                    <div className="w-8 md:w-20 h-[2px] bg-[#cbd5e1]"></div>
                    {t("author")}
                </div>

            </div>
        </section>
    );
}
