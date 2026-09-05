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

export const dynamic = "force-dynamic";

function getSocialIcon(name: string) {
  const n = name.toLowerCase();
  if (n.includes("linkedin")) return <Linkedin className="w-4 h-4" />;
  if (n.includes("github")) return <Github className="w-4 h-4" />;
  if (n.includes("facebook")) return <Facebook className="w-4 h-4" />;
  if (n.includes("instagram")) return <Instagram className="w-4 h-4" />;
  return <Globe className="w-4 h-4" />;
}

export default async function ContactPage() {
  const [profile, socials, t] = await Promise.all([
    getPublicSiteProfile(), 
    getPublicSocialLinks(),
    getTranslations("ContactPage")
  ]);

  return (
    <section className="pt-4 sm:pt-8 pb-12 min-h-screen relative font-sans">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Compact Header ── */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-400 mb-2.5 shadow-sm">
            <MessageSquare className="w-5 h-5 stroke-[2]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-1.5">
            {t("title")}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            {t("desc")}
          </p>
        </div>

        {/* ── 2-Column Responsive Layout ── */}
        <div className="grid lg:grid-cols-12 gap-5 sm:gap-6 items-start">
          {/* Left Column: Contact Hub (Combined Information & Social Channels) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-4 sm:p-5 rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm transition-all">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
                {t("infoTitle")}
              </h3>

              <div className="space-y-3">
                {profile.location ? (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 shrink-0">
                      <MapPin className="w-4 h-4 text-cyan-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold text-slate-400">{t("address")}</p>
                      <p className="text-xs sm:text-[13px] font-medium text-slate-800 dark:text-slate-200 truncate">
                        {profile.location}
                      </p>
                    </div>
                  </div>
                ) : null}

                {profile.email ? (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 shrink-0">
                      <Mail className="w-4 h-4 text-cyan-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold text-slate-400">{t("email")}</p>
                      <Link
                        href={`mailto:${profile.email}`}
                        className="text-xs sm:text-[13px] font-semibold text-cyan-600 hover:text-cyan-700 hover:underline dark:text-cyan-400 transition-colors truncate block"
                      >
                        {profile.email}
                      </Link>
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Social Channels inside the same hub */}
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2.5">
                  {t("socialTitle")}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-1.5">
                  {socials.length ? (
                    socials.map((social) => (
                      <Link
                        key={social.id}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors group"
                      >
                        <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 group-hover:bg-cyan-50 group-hover:text-cyan-600 dark:group-hover:bg-cyan-950/40 dark:group-hover:text-cyan-400 transition-colors shrink-0">
                          {getSocialIcon(social.name)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {social.name}
                          </p>
                          <p className="text-[10px] text-slate-400 truncate">
                            {social.url.replace(/^https?:\/\/(www\.)?/, "")}
                          </p>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400">{t("socialEmpty")}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Send Message Form */}
          <div className="lg:col-span-7">
            <div className="p-5 sm:p-6 rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm transition-all">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight mb-1">
                {t("formTitle")}
              </h3>
              <p className="mb-4 text-slate-500 dark:text-slate-400 text-xs sm:text-[13px]">
                {t("formDesc")}
              </p>
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
