import Link from "next/link";
import { FaFacebook, FaGithub, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { Code, Paintbrush } from "lucide-react";
import { Container } from "@/components/common/container";
import { ResumeModalWrapper } from "@/components/ui/resume-modal-wrapper";
import { getPublicSiteProfile, getPublicSocialLinks } from "@/features/portfolio/portfolio.service";
import { getTranslations } from "next-intl/server";

const socialIconMap = {
  github: FaGithub,
  linkedin: FaLinkedinIn,
  instagram: FaInstagram,
  facebook: FaFacebook,
};

export async function Hero() {
  const [profile, socials, t] = await Promise.all([
    getPublicSiteProfile(), 
    getPublicSocialLinks(),
    getTranslations("Hero")
  ]);

  return (
    <section className="bg-white relative overflow-hidden pt-24 lg:pt-32 pb-16">
      <Container className="relative z-10 w-full">
        <div className="flex flex-col lg:flex-row items-center w-full gap-12 lg:gap-8">
          <div className="lg:w-1/2 flex flex-col items-start w-full relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100/60 text-blue-600 mb-6 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
              </span>
              <span className="text-xs font-bold tracking-widest uppercase">{t("hello")}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[72px] font-black mb-2 text-slate-900 leading-[1.1] tracking-[-0.02em]">
              {profile.name}
            </h1>

            <h2 className="text-2xl sm:text-3xl lg:text-[42px] mb-6 text-slate-600 tracking-tight font-bold">
              {profile.role}
            </h2>

            <p className="text-slate-500 text-base sm:text-lg leading-relaxed max-w-[48ch] mb-10 font-medium">
              {profile.intro || profile.headline}
            </p>

            <div className="flex flex-wrap items-center gap-3 mb-10">
              <Link href="/work/contact" className="inline-flex items-center justify-center rounded-full px-6 py-2.5 bg-slate-900 text-white hover:bg-slate-800 border border-slate-900 font-semibold text-sm transition-all hover:-translate-y-0.5 active:translate-y-0">
                {t("talk")}
              </Link>
              {profile.resumeUrl ? (
                <div>
                  <ResumeModalWrapper resumeUrl={profile.resumeUrl} />
                </div>
              ) : null}
            </div>

            <div className="flex items-center gap-3">
              {socials.map((social) => {
                const Icon = socialIconMap[social.name.toLowerCase() as keyof typeof socialIconMap] ?? FaGithub;
                return (
                  <Link
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-cyan-600 hover:border-cyan-200 transition-all hover:-translate-y-1"
                    aria-label={social.name}
                  >
                    <Icon className="w-[18px] h-[18px]" />
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="lg:w-1/2 flex justify-center lg:justify-end relative z-10 w-full mb-8 lg:mb-0">
            <div className="relative">
              <div className="w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] lg:w-[460px] lg:h-[460px] rounded-full p-2.5 relative overflow-hidden bg-white border border-slate-200">
                <div className="w-full h-full rounded-full flex items-center justify-center overflow-hidden bg-slate-50 border border-slate-100">
                  <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover object-[65%_35%] transition-transform duration-700 hover:scale-105" loading="eager" />
                </div>
              </div>

              <div className="absolute top-6 -right-2 sm:top-12 sm:-right-6 w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-2xl flex items-center justify-center rotate-[15deg] transition-all duration-300 hover:scale-110 hover:rotate-6 border border-slate-200 shadow-sm">
                <Code className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
              </div>
              <div className="absolute bottom-12 left-0 sm:bottom-16 sm:-left-4 w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-2xl flex items-center justify-center -rotate-[15deg] transition-all duration-300 hover:scale-110 hover:-rotate-6 border border-slate-200 shadow-sm">
                <Paintbrush className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-500" />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
