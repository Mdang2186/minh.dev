import Link from "next/link";
import { 
  Github, 
  Linkedin, 
  Facebook, 
  Instagram, 
  Globe, 
  Mail, 
  MapPin, 
  MessageSquare,
} from "lucide-react";
import { ContactForm } from "@/components/sections/contact/contact-form";
import { getPublicSiteProfile, getPublicSocialLinks } from "@/features/portfolio/portfolio.service";
import { getTranslations } from "next-intl/server";

export const revalidate = 3600;

function getSocialIcon(name: string) {
  const n = name.toLowerCase();
  if (n.includes("linkedin")) return <Linkedin className="w-5 h-5" />;
  if (n.includes("github")) return <Github className="w-5 h-5" />;
  if (n.includes("facebook")) return <Facebook className="w-5 h-5" />;
  if (n.includes("instagram")) return <Instagram className="w-5 h-5" />;
  return <Globe className="w-5 h-5" />;
}

export default async function ContactPage() {
  const [profile, socials, t] = await Promise.all([
    getPublicSiteProfile(), 
    getPublicSocialLinks(),
    getTranslations("ContactPage")
  ]);

  return (
    <section className="pt-8 sm:pt-16 pb-20 min-h-screen relative font-sans">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Compact Header ── */}
        <div className="text-center mb-10 sm:mb-16">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-cyan-50 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-400 mb-6 shadow-sm">
            <MessageSquare className="w-7 h-7 stroke-[2]" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
            {t("title")}
          </h1>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
            {t("desc")}
          </p>
        </div>

        {/* ── 2-Column Responsive Layout ── */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Contact Hub (Combined Information & Social Channels) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 sm:p-8 rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm transition-all">
              <h3 className="text-xs font-bold uppercase tracking-widest text-cyan-600 dark:text-cyan-400 mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-500" />
                {t("infoTitle")}
              </h3>

              <div className="space-y-6">
                {profile.location ? (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 pt-0.5">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{t("address")}</p>
                      <p className="text-sm sm:text-[15px] font-medium text-slate-800 dark:text-slate-200 leading-snug">
                        {profile.location}
                      </p>
                    </div>
                  </div>
                ) : null}

                {profile.phone ? (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                    </div>
                    <div className="min-w-0 pt-0.5">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{t("phone")}</p>
                      <Link
                        href={`tel:${profile.phone}`}
                        className="text-sm sm:text-[15px] font-medium text-slate-800 dark:text-slate-200 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors truncate block"
                      >
                        {profile.phone}
                      </Link>
                    </div>
                  </div>
                ) : null}

                {profile.email ? (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 pt-0.5">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{t("email")}</p>
                      <Link
                        href={`mailto:${profile.email}`}
                        className="text-sm sm:text-[15px] font-medium text-slate-800 dark:text-slate-200 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors truncate block"
                      >
                        {profile.email}
                      </Link>
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Social Channels inside the same hub */}
              <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-5">
                  {t("socialTitle")}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                  {socials.length ? (
                    socials.map((social) => (
                      <Link
                        key={social.id}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors group border border-transparent hover:border-slate-200/50 dark:hover:border-slate-700/50"
                      >
                        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 group-hover:bg-cyan-50 group-hover:text-cyan-600 dark:group-hover:bg-cyan-950/40 dark:group-hover:text-cyan-400 transition-colors shrink-0">
                          {getSocialIcon(social.name)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[15px] font-bold text-slate-900 dark:text-white truncate">
                            {social.name}
                          </p>
                          <p className="text-xs text-slate-400 truncate">
                            {social.url.replace(/^https?:\/\/(www\.)?/, "")}
                          </p>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <p className="text-sm text-slate-400 italic px-2">{t("socialEmpty")}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Send Message Form */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm transition-all">
              <div className="mb-8">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">
                  {t("formTitle")}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-[15px]">
                  {t("formDesc")}
                </p>
              </div>
              
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
