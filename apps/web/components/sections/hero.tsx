import Link from "next/link";
import { Container } from "@/components/common/container";
import { site } from "@/data/site";
import { siteConfig } from "@/features/site/site.config";
import { FaInstagram, FaFacebook, FaGithub, FaLinkedinIn } from "react-icons/fa";
import { Code, Paintbrush, FileText } from "lucide-react";
import { ResumeModal } from "@/components/ui/resume-modal";

export function Hero() {
    return (
        <section className="bg-background relative overflow-hidden pt-24 lg:pt-32 pb-16">
            <Container className="relative z-10 w-full">
                <div className="flex flex-col lg:flex-row items-center w-full">

                    {/* Left Column: Text & Actions */}
                    <div className="lg:w-1/2 mb-12 lg:mb-0 z-10 flex flex-col items-start w-full">
                        <p className="text-blue-600 mb-3 tracking-[0.2em] font-bold text-sm uppercase">
                            HELLO THERE, I'M
                        </p>

                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-4 text-slate-900 leading-tight uppercase tracking-tighter drop-shadow-lg">
                            {siteConfig.author.name}
                        </h1>

                        <div className="h-1.5 w-40 bg-blue-600 mb-8 rounded-full"></div>

                        <h2 className="text-3xl sm:text-4xl lg:text-[40px] mb-6 text-slate-800 tracking-tight font-medium">
                            Creative <span className="text-blue-600 font-semibold">Designer</span> & <span className="text-blue-600 font-semibold">Developer</span>
                        </h2>

                        <p className="text-slate-500 text-[15px] sm:text-[16px] leading-[1.8] max-w-[48ch] mb-10">
                            I am a <span className="font-semibold text-slate-800">Software Engineering graduate</span> seeking to grow in <span className="font-medium text-blue-600">Frontend & UX/UI</span>, starting from an <span className="font-medium text-blue-500">internship role</span> to apply my <span className="text-blue-500">programming knowledge</span> and <span className="text-blue-500">interface design skills</span>. I am eager to learn and contribute to real-world projects.
                        </p>

                        <div className="flex flex-wrap items-center gap-4 mb-12">
                            <Link href="/work/contact" className="inline-flex items-center justify-center rounded-full px-8 py-4 bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/20 font-bold text-[15px] transition-all hover:-translate-y-1">
                                Let's Talk
                            </Link>
                            <Link href="/work/projects" className="inline-flex items-center justify-center rounded-full px-8 py-4 border-2 border-slate-200 text-slate-900 hover:bg-slate-50 font-bold text-[15px] transition-all hover:-translate-y-1 bg-white shadow-sm">
                                View Work
                            </Link>
                            <ResumeModal resumeUrl={site.links.resume} />
                        </div>

                        {/* Social Icons */}
                        <div className="flex items-center gap-4">
                            <Link href={site.links.instagram} target="_blank" className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-blue-600 hover:text-white transition-all hover:-translate-y-1 shadow-sm">
                                <FaInstagram className="w-4 h-4" />
                            </Link>
                            <Link href={site.links.facebook} target="_blank" className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-blue-600 hover:text-white transition-all hover:-translate-y-1 shadow-sm">
                                <FaFacebook className="w-4 h-4" />
                            </Link>
                            <Link href={site.links.github} target="_blank" className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-blue-600 hover:text-white transition-all hover:-translate-y-1 shadow-sm">
                                <FaGithub className="w-4 h-4" />
                            </Link>
                            <Link href={site.links.linkedin} target="_blank" className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-blue-600 hover:text-white transition-all hover:-translate-y-1 shadow-sm">
                                <FaLinkedinIn className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>

                    {/* Right Column: Avatar Illustration */}
                    <div className="lg:w-1/2 flex justify-center lg:justify-end relative z-10 w-full mt-8 lg:mt-0">
                        <div className="relative">
                            <div className="w-[300px] h-[300px] sm:w-[420px] sm:h-[420px] lg:w-[480px] lg:h-[480px] rounded-full border-[2px] border-blue-500 p-2 relative overflow-hidden bg-white shadow-2xl shadow-blue-900/10">
                                <div className="w-full h-full rounded-full flex items-center justify-center overflow-hidden bg-slate-100">
                                    <img src="/avatar1.png" alt="Avatar" className="w-full h-full object-cover object-[65%_35%]" loading="eager" />
                                </div>
                            </div>

                            {/* Decorative blur glows */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] rounded-full bg-blue-100 opacity-50 blur-3xl pointer-events-none -z-10"></div>

                            {/* Floating code and designer elements */}
                            <div className="absolute top-4 -right-4 sm:top-10 sm:-right-8 w-16 h-16 sm:w-20 sm:h-20 bg-white shadow-2xl rounded-2xl flex items-center justify-center rotate-12 transition-transform hover:scale-110 hover:rotate-6 border border-slate-100">
                                <Code className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-500" />
                            </div>
                            <div className="absolute bottom-10 left-0 sm:bottom-12 sm:-left-6 w-16 h-16 sm:w-20 sm:h-20 bg-white shadow-2xl rounded-2xl flex items-center justify-center -rotate-12 transition-transform hover:scale-110 hover:-rotate-6 border border-slate-100">
                                <Paintbrush className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
                            </div>
                        </div>
                    </div>

                </div>
            </Container>
        </section>
    );
}
