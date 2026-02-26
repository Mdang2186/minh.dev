export function Quote() {
    return (
        <section className="py-6 md:py-10 flex justify-center items-center px-4 relative max-w-7xl mx-auto">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-cyan-200/50 to-transparent"></div>

            <div className="flex items-start gap-4 md:gap-8 mt-6 mb-6 w-full max-w-4xl mx-auto">
                {/* Quote Icon */}
                <div className="flex space-x-[8px] mt-2 md:mt-3 shrink-0">
                    <div className="w-[14px] md:w-[18px] h-[36px] md:h-[46px] bg-slate-200 skew-x-[-20deg]"></div>
                    <div className="w-[14px] md:w-[18px] h-[36px] md:h-[46px] bg-slate-200 skew-x-[-20deg]"></div>
                </div>

                {/* Text */}
                <div className="text-[28px] sm:text-[36px] md:text-[46px] lg:text-[52px] leading-[1.2] text-slate-500 tracking-tight flex flex-col items-start font-medium w-full">

                    {/* Line 1 */}
                    <div className="italic text-slate-500/90 font-light">Design is not just</div>

                    {/* Line 2 */}
                    <div className="flex items-center gap-2 md:gap-4 my-1 md:my-2 flex-wrap">
                        <div className="hidden lg:block w-8 md:w-16 h-[1.5px] bg-slate-300 shrink-0"></div>
                        <span className="flex gap-x-[6px] md:gap-x-2 gap-y-1 items-baseline flex-wrap">
                            <span className="font-light">what it</span>
                            <span className="font-extrabold text-slate-700">looks like</span>
                            <span className="font-light">and</span>
                            <span className="font-extrabold text-slate-700">feels like.</span>
                        </span>
                        <div className="hidden lg:block w-8 md:w-16 h-[1.5px] bg-slate-300 shrink-0"></div>
                    </div>

                    {/* Line 3 */}
                    <div className="flex items-center gap-2 md:gap-3 mt-2 flex-wrap">
                        <span className="font-light">Design is</span>
                        <span className="font-extrabold text-slate-700 bg-slate-100 px-4 md:px-5 py-2 md:py-3 rounded-[0.75rem] ml-1 shadow-sm leading-none flex items-center justify-center">
                            how it works.
                        </span>
                    </div>

                    {/* Author */}
                    <div className="mt-8 text-base sm:text-lg md:text-xl text-slate-400 font-medium self-end flex items-center gap-3">
                        <div className="w-8 sm:w-12 h-[1.5px] bg-slate-300"></div>
                        Steve Jobs
                    </div>

                </div>
            </div>
        </section>
    );
}
