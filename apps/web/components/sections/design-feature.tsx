import { CheckCircle2, Code2, MonitorSmartphone, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";

export function DesignFeature() {
    const t = useTranslations("DesignFeature");

    return (
        <section className="py-12 lg:py-16 max-w-7xl mx-auto px-4 sm:px-6 relative">
            <div className="mb-10 max-w-3xl text-center lg:text-left mx-auto lg:mx-0">
                <h3 className="text-xs sm:text-sm font-bold tracking-widest text-[#0ea5e9] uppercase mb-3 flex items-center justify-center lg:justify-start gap-2">
                    <Sparkles className="w-4 h-4" />
                    {t("tagline")}
                </h3>
                <h2 className="text-3xl sm:text-4xl md:text-[40px] font-extrabold text-[#0f172a] tracking-tight mb-4 leading-tight">
                    {t("title1")} {t("title2")}
                </h2>
                <p className="text-[#64748b] text-sm md:text-base max-w-2xl leading-relaxed font-medium mx-auto lg:mx-0">
                    {t("desc")}
                </p>
            </div>

            <div className="relative rounded-[2rem] bg-gradient-to-br from-slate-50 to-slate-100/50 border border-slate-200/60 overflow-hidden px-4 sm:px-8 py-10 md:py-16 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
                {/* Dot Pattern Background */}
                <div
                    className="absolute inset-0 z-0 opacity-40 pointer-events-none"
                    style={{
                        backgroundImage: 'radial-gradient(#cbd5e1 1.5px, transparent 1.5px)',
                        backgroundSize: '24px 24px'
                    }}
                ></div>

                <div className="relative z-10 grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">

                    {/* Left Side: Frontend Principles */}
                    <div className="lg:col-span-5 flex flex-col gap-4 w-full max-w-[500px] mx-auto lg:mx-0">
                        {[
                            { icon: Code2, color: "text-blue-500", bg: "bg-blue-100", title: t("feat1Title"), desc: t("feat1Desc") },
                            { icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-100", title: t("feat2Title"), desc: t("feat2Desc") },
                            { icon: MonitorSmartphone, color: "text-purple-500", bg: "bg-purple-100", title: t("feat3Title"), desc: t("feat3Desc") },
                        ].map((item, i) => (
                            <div
                                key={i}
                                className="group flex items-start gap-4 p-4 rounded-2xl transition-all hover:bg-white hover:shadow-[0_8px_30px_rgb(0,0,0,0.05)] border border-transparent hover:border-slate-100 cursor-default bg-white/40 md:bg-transparent"
                            >
                                <div className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center ${item.bg} ${item.color} group-hover:scale-110 transition-transform duration-300`}>
                                    <item.icon className="w-5 h-5" />
                                </div>
                                <div className="flex flex-col">
                                    <h4 className="font-extrabold text-[#1e293b] text-base md:text-[17px] tracking-tight mb-1 group-hover:text-cyan-600 transition-colors">
                                        {item.title}
                                    </h4>
                                    <p className="text-[13px] sm:text-sm text-[#64748b] font-medium leading-relaxed">
                                        {item.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right Side: Code Editor Mockup */}
                    <div className="lg:col-span-7 flex items-center justify-center w-full relative perspective-1000">
                        {/* Glows */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-400/20 rounded-full blur-[80px] -z-10 pointer-events-none hidden md:block"></div>
                        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-64 h-64 bg-cyan-300/20 rounded-full blur-[60px] -z-10 pointer-events-none hidden md:block"></div>

                        {/* Editor Window */}
                        <div className="w-full max-w-[600px] bg-[#0f172a] rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden transform md:hover:-translate-y-2 md:hover:rotate-1 transition-all duration-500 hover:shadow-cyan-900/40">

                            {/* Mac Window Header */}
                            <div className="flex items-center gap-2 px-4 py-3 bg-[#1e293b] border-b border-slate-700/50">
                                <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                                <div className="mx-auto text-[11px] sm:text-xs font-medium text-slate-400 font-mono select-none">App.tsx</div>
                            </div>

                            {/* Code Content */}
                            <div className="p-4 sm:p-6 text-[10.5px] sm:text-[13px] font-mono text-slate-300 overflow-x-auto leading-[1.8] scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                                <div className="flex w-max"><span className="text-slate-500 mr-3 sm:mr-4 select-none shrink-0">1</span><span className="text-purple-400">import</span> {'{ '}<span className="text-blue-300">FrontendDev</span>{' } '}<span className="text-purple-400">from</span> <span className="text-emerald-300">'@profile'</span>;</div>
                                <div className="flex w-max"><span className="text-slate-500 mr-3 sm:mr-4 select-none shrink-0">2</span></div>
                                <div className="flex w-max"><span className="text-slate-500 mr-3 sm:mr-4 select-none shrink-0">3</span><span className="text-purple-400">export default function</span> <span className="text-blue-400">Portfolio</span>() {'{'}</div>
                                <div className="flex w-max"><span className="text-slate-500 mr-3 sm:mr-4 select-none shrink-0">4</span>  <span className="text-purple-400">return</span> (</div>
                                <div className="flex w-max"><span className="text-slate-500 mr-3 sm:mr-4 select-none shrink-0">5</span>    <span className="text-slate-400">&lt;</span><span className="text-rose-400">FrontendDev</span></div>
                                <div className="flex w-max"><span className="text-slate-500 mr-3 sm:mr-4 select-none shrink-0">6</span>      <span className="text-amber-200">name</span>=<span className="text-emerald-300">"Do Cong Minh"</span></div>
                                <div className="flex w-max"><span className="text-slate-500 mr-3 sm:mr-4 select-none shrink-0">7</span>      <span className="text-amber-200">role</span>=<span className="text-emerald-300">"Intern / Fresher"</span></div>
                                <div className="flex w-max"><span className="text-slate-500 mr-3 sm:mr-4 select-none shrink-0">8</span>      <span className="text-amber-200">skills</span>=<span className="text-blue-300">{'{'}</span>[<span className="text-emerald-300">'React'</span>, <span className="text-emerald-300">'Next'</span>, <span className="text-emerald-300">'CSS'</span>]<span className="text-blue-300">{'}'}</span></div>
                                <div className="flex w-max"><span className="text-slate-500 mr-3 sm:mr-4 select-none shrink-0">9</span>      <span className="text-amber-200">passion</span>=<span className="text-blue-300">{'{'}</span><span className="text-emerald-300">"Clean Code"</span><span className="text-blue-300">{'}'}</span></div>
                                <div className="flex w-max"><span className="text-slate-500 mr-3 sm:mr-4 select-none shrink-0">10</span>    <span className="text-slate-400">/&gt;</span></div>
                                <div className="flex w-max"><span className="text-slate-500 mr-3 sm:mr-4 select-none shrink-0">11</span>  );</div>
                                <div className="flex w-max"><span className="text-slate-500 mr-3 sm:mr-4 select-none shrink-0">12</span>{'}'}</div>
                                <div className="flex mt-2 w-max animate-pulse"><span className="text-slate-500 mr-3 sm:mr-4 select-none opacity-0 shrink-0">13</span><span className="w-1.5 sm:w-2 h-3.5 sm:h-4 bg-cyan-400 inline-block"></span></div>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </section>
    );
}
