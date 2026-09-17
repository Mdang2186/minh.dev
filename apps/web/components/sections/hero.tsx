import Link from "next/link";
import { Container } from "@/components/common/container";
import { ResumeModalWrapper } from "@/components/ui/resume-modal-wrapper";
import { Lanyard } from "@/components/ui/lanyard";
import { SocialLinks } from "@/components/ui/social-links";
import { getPublicSiteProfile, getPublicSocialLinks, getPublicEducations, getPublicCertifications } from "@/features/portfolio/portfolio.service";
import { getTranslations } from "next-intl/server";

export async function Hero() {
  const [profile, socials, educations, certifications, t] = await Promise.all([
    getPublicSiteProfile(),
    getPublicSocialLinks(),
    getPublicEducations(),
    getPublicCertifications(),
    getTranslations("Hero")
  ]);

  const education = educations[0];

  return (
    <section className="relative pt-8 lg:pt-16 pb-20 overflow-hidden">
      <style>{`
        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          background: #0F172A;
          color: white;
          border: none;
          border-radius: 50px;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.03em;
          cursor: pointer;
          transition: background 0.3s ease, transform 0.2s ease;
          text-decoration: none;
          box-shadow: 0 4px 14px rgba(15,23,42,0.25);
        }
        .btn-primary:hover { background: #0EA5E9; transform: translateY(-2px); box-shadow: 0 6px 18px rgba(14,165,233,0.35); }
        .btn-primary:active { transform: scale(0.97); }
        .btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          background: rgba(14,165,233,0.1);
          color: #0F172A;
          border: none;
          border-radius: 50px;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.03em;
          cursor: pointer;
          transition: background 0.3s ease, transform 0.2s ease;
          text-decoration: none;
        }
        .btn-secondary:hover { background: rgba(14,165,233,0.2); transform: translateY(-2px); }
        .btn-secondary svg { transition: transform 0.3s ease; }
        .btn-secondary:hover svg { transform: translateX(4px); }
        .btn-secondary:active { transform: scale(0.97); }
      `}</style>

      <Container className="relative z-10 w-full max-w-[1400px] mx-auto">
        <div className="flex flex-col lg:flex-row items-center w-full gap-10 lg:gap-12">

          {/* LEFT: About Me Content */}
          <div className="lg:w-7/12 flex flex-col items-start w-full relative z-10">

            {/* Label */}
            <div className="flex items-center gap-2 mb-5">
              <span className="w-2 h-2 rounded-full bg-[#0EA5E9]" />
              <span className="text-[#0EA5E9] font-bold text-xs tracking-[0.25em] uppercase">About Me</span>
            </div>

            {/* Name - full gradient from black to sky */}
            <h2 className="font-black text-[52px] sm:text-[72px] lg:text-[88px] leading-none uppercase mb-6 tracking-tight">
              <span className="bg-gradient-to-r from-[#0F172A] via-[#1e3a5f] to-[#0EA5E9] bg-clip-text text-transparent">
                DO CONG MINH
              </span>
            </h2>

            {/* Bio */}
            <div className="text-[#334155] text-base sm:text-lg leading-relaxed font-medium mb-8 space-y-3 max-w-2xl">
              {profile.intro && profile.intro.length > 50 ? (
                <p>{profile.intro}</p>
              ) : (
                <>
                  <p>
                    As a <strong className="text-[#0F172A]">Software Engineer</strong> graduate with a strong technical background in programming, I aim to specialize as an IT Business Analyst.
                  </p>
                  <p>
                    My strong logical thinking enables me to grasp complex business domains quickly and act as an effective bridge between clients and the development team, thereby standardizing system documentation and optimizing operational workflows.
                  </p>
                </>
              )}
            </div>

            {/* Education + Certifications Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full mb-5">
              {/* Education */}
              {education && (
                <div>
                  <h3 className="font-black text-[#0F172A] uppercase text-base tracking-widest mb-3 border-b-2 border-[#0EA5E9] pb-1 inline-block">
                    Education
                  </h3>
                  <div className="text-[#0F172A] font-semibold text-base leading-snug mb-1">
                    {education.org}
                  </div>
                  {education.period && (
                    <div className="text-slate-400 text-sm mb-2">({education.period})</div>
                  )}
                  <ul className="space-y-1">
                    {education.major && (
                      <li className="flex items-start gap-2 text-[#334155] text-sm">
                        <span className="text-[#0EA5E9] mt-1">•</span> {education.major}
                      </li>
                    )}
                    {education.gpa && (
                      <li className="flex items-start gap-2 text-[#334155] text-sm">
                        <span className="text-[#0EA5E9] mt-1">•</span> GPA: <strong className="text-[#0F172A]">{education.gpa}</strong>/4.0
                      </li>
                    )}
                  </ul>
                </div>
              )}

              {/* Certifications */}
              {certifications && certifications.length > 0 && (
                <div>
                  <h3 className="font-black text-[#0F172A] uppercase text-base tracking-widest mb-3 border-b-2 border-[#0EA5E9] pb-1 inline-block">
                    Certifications
                  </h3>
                  <ul className="space-y-2">
                    {certifications.slice(0, 3).map(cert => (
                      <li key={cert.id} className="flex items-start justify-between gap-4">
                        <span className="flex items-start gap-2 text-[#334155] text-sm">
                          <span className="text-[#0EA5E9] mt-1 shrink-0">•</span>
                          {cert.title}{cert.score ? `: ${cert.score}` : ''}
                        </span>
                        {cert.date && (
                          <span className="text-slate-400 text-xs whitespace-nowrap mt-0.5 shrink-0">{cert.date}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Buttons + Social Row */}
            <div className="flex flex-wrap items-center gap-2 mt-2">
              {/* Let's Talk */}
              <Link href="/work/contact" className="btn-primary">
                Let's Talk
              </Link>

              {/* Resume */}
              <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="btn-secondary">
                Resume
                <svg width="14px" height="10px" viewBox="0 0 13 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1,5 L11,5" />
                  <polyline points="8 1 12 5 8 9" />
                </svg>
              </a>

              {/* Social Icons */}
              <div className="ml-1">
                <SocialLinks socials={socials} />
              </div>
            </div>
          </div>

          {/* RIGHT: Lanyard Card — shifted down */}
          <div className="lg:w-5/12 flex justify-center lg:justify-end relative z-0 w-full min-h-[580px] lg:h-[700px] pointer-events-auto cursor-grab active:cursor-grabbing [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_100%)] pt-10 lg:pt-16">
            <div className="absolute inset-x-0 top-0 bottom-0 z-0">
              <Lanyard position={[0, 0, 9]} gravity={[0, -40, 0]} fov={20} profile={profile} />
            </div>
          </div>

        </div>
      </Container>
    </section>
  );
}
