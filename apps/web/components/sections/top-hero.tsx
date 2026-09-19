"use client";

import Image from "next/image";
import Link from "next/link";
import { Anton } from "next/font/google";
import { SocialLinks } from "@/components/ui/social-links";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
});

const ctaStyles = `
  /* ===== Unified Button System ===== */
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

  .cta-resume {
    position: relative;
    padding: 12px 18px;
    transition: all 0.2s ease;
    border: none;
    background: none;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
  }
  .cta-resume:before {
    content: "";
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    display: block;
    border-radius: 50px;
    background: #b1dae7;
    width: 45px;
    height: 45px;
    transition: all 0.3s ease;
  }
  .cta-resume span {
    position: relative;
    font-family: "Ubuntu", sans-serif;
    font-size: 16px;
    font-weight: 700;
    letter-spacing: 0.05em;
    color: #234567;
  }
  .cta-resume svg {
    position: relative;
    margin-left: 10px;
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke: #234567;
    stroke-width: 2;
    transform: translateX(-5px);
    transition: all 0.3s ease;
  }
  .cta-resume:hover:before {
    width: 100%;
    background: #b1dae7;
  }
  .cta-resume:hover svg {
    transform: translateX(0);
  }
  .cta-resume:active {
    transform: scale(0.95);
  }
`;
export function TopHero({ socials = [] }: { socials?: any[] }) {
  return (
    <>
      <style>{ctaStyles}</style>
      <section className="relative w-full h-[100dvh] min-h-[800px] md:min-h-[800px] overflow-hidden bg-white flex items-center justify-center font-sans">
        {/* Layer 0: The Main Container Backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] md:w-[60vw] md:h-[60vw] bg-[#E0F2FE] rounded-full blur-3xl z-0 pointer-events-none" />

        {/* DESKTOP LAYOUT (lg and above) */}
        <div className="hidden lg:block w-full h-full relative z-10">
          {/* Layer 1 - Z-10: The Giant Background Typography */}
          <div className="absolute top-[8%] lg:top-[10%] left-1/2 -translate-x-1/2 w-full max-w-[90rem] px-4 sm:px-6 flex items-center z-10 pointer-events-none">
            <h1
              className={`w-full text-center lg:text-left text-[20vw] lg:text-[22vw] xl:text-[24vw] 2xl:text-[362px] leading-none tracking-normal uppercase relative ${anton.className}`}
            >
              <span className="bg-gradient-to-r from-[#0F172A] to-[#0EA5E9] text-transparent bg-clip-text drop-shadow-sm">
                PORTFOLIO
              </span>
            </h1>
          </div>

          {/* Layer 2 - Z-20: The PNG Subject */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-20 pointer-events-none w-full h-[85vh] flex justify-center">
            <div
              className="relative w-full h-full max-w-[800px]"
              style={{
                maskImage:
                  "linear-gradient(to bottom, black 85%, transparent 100%)",
                WebkitMaskImage:
                  "linear-gradient(to bottom, black 85%, transparent 100%)",
              }}
            >
              <Image
                src="/images/first_page.png"
                alt="Do Cong Minh"
                fill
                className="object-contain object-bottom drop-shadow-2xl"
                priority
              />
            </div>
          </div>

          {/* Layer 3 - Z-30: Foreground Content Container */}
          <div className="absolute bottom-20 xl:bottom-28 left-1/2 -translate-x-1/2 w-full max-w-[90rem] px-4 sm:px-6 flex justify-between items-end z-30">
            {/* Bottom Left Content */}
            <div className="flex flex-col items-start gap-4 max-w-lg">
              <h3 className="font-bold text-[30px] uppercase tracking-[0.4em] whitespace-nowrap">
                <span className="bg-gradient-to-r from-[#0F172A] to-[#0EA5E9] text-transparent bg-clip-text">
                  D O C O N G&nbsp;&nbsp;M I N H
                </span>
              </h3>
              <p className="text-[#334155] text-[18px] leading-relaxed font-medium">
                I am Cong Minh, a recently graduated Information Technology
                student focusing on business analysis and system optimization.
              </p>
              {/* Buttons Row */}
              <div className="flex items-center gap-3 mt-3 flex-wrap">
                <Link href="/work/contact" className="btn-primary">
                  Let's Talk
                </Link>
                <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">
                  <button className="cta-resume">
                    <span>Resume</span>
                    <svg width="15px" height="10px" viewBox="0 0 13 10">
                      <path d="M1,5 L11,5"></path>
                      <polyline points="8 1 12 5 8 9"></polyline>
                    </svg>
                  </button>
                </a>
              </div>
            </div>

            {/* Bottom Right Content */}
            <div className="flex flex-col items-end gap-5 max-w-[500px] text-right">
              <p className="text-[#334155] text-[18px] leading-relaxed font-medium">
                I am highly motivated to join a professional team, where I can
                actively contribute to software development projects and
                translate complex business needs into practical technical
                solutions.
              </p>
              <div className="flex gap-2 justify-end mt-2">
                <SocialLinks socials={socials} />
              </div>
            </div>
          </div>

          {/* Layer 3 - Z-30: Top Right Doodle Arrow */}
          <div className="absolute top-24 right-[15%] xl:right-32 z-30 w-20 h-20 xl:w-24 xl:h-24 pointer-events-none transform rotate-12">
            <svg
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full drop-shadow-md"
            >
              <path
                d="M 20 20 L 70 40 L 50 50 L 65 75 L 50 85 L 35 60 L 15 80 Z"
                fill="#FFFFFF"
                stroke="#020e29ff"
                strokeWidth="4"
                strokeLinejoin="round"
              />
              <path
                d="M 23 23 L 68 41 L 49 51 L 63 74 L 52 81 L 37 59 L 19 77 Z"
                fill="none"
                stroke="#00aeffff"
                strokeWidth="1.5"
              />
            </svg>
          </div>
        </div>

        {/* MOBILE LAYOUT (Stacking for screens < lg) */}
        <div className="lg:hidden flex flex-col items-center pt-10 px-4 relative z-30 w-full h-full overflow-y-auto">
          <h1
            className={`w-full text-center text-[20vw] sm:text-[22vw] leading-none tracking-normal uppercase mb-2 relative ${anton.className}`}
          >
            <span className="bg-gradient-to-r from-[#0F172A] to-[#0EA5E9] text-transparent bg-clip-text drop-shadow-sm">
              PORTFOLIO
            </span>
          </h1>

          <div
            className="relative w-full h-[40vh] sm:h-[45vh] z-20 pointer-events-none shrink-0"
            style={{
              maskImage:
                "linear-gradient(to bottom, black 80%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, black 80%, transparent 100%)",
            }}
          >
            <Image
              src="/images/first_page.png"
              fill
              className="object-contain object-bottom drop-shadow-2xl"
              alt="Do Cong Minh"
              priority
            />
          </div>

          <div className="w-full flex flex-col items-center text-center mt-2 gap-4 pb-6 z-30 flex-1">
            <h3 className="font-bold text-[20px] sm:text-[24px] uppercase tracking-[0.3em] whitespace-nowrap">
              <span className="bg-gradient-to-r from-[#0F172A] to-[#0EA5E9] text-transparent bg-clip-text">
                D O C O N G&nbsp;&nbsp;M I N H
              </span>
            </h3>
            <p className="text-[#334155] text-[16px] leading-snug font-medium max-w-xs">
              I am Cong Minh, a recently graduated Information Technology
              student focusing on business analysis and system optimization.
            </p>
            <Link href="/work/contact" className="btn-primary">
              Let's Talk
            </Link>
            <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">
              <button className="cta-resume">
                <span>Resume</span>
                <svg width="15px" height="10px" viewBox="0 0 13 10">
                  <path d="M1,5 L11,5"></path>
                  <polyline points="8 1 12 5 8 9"></polyline>
                </svg>
              </button>
            </a>
            <div className="flex gap-2 justify-center mt-2">
              <SocialLinks socials={socials} />
            </div>
          </div>
        </div>

        {/* Seamless fade to next section */}
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white to-transparent z-30 pointer-events-none" />
      </section>
    </>
  );
}
