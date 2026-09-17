"use client";

import Link from "next/link";

const socialStyles = `
  .social-wrapper {
    display: inline-flex;
    list-style: none;
    padding: 0;
    margin: 0;
    gap: 8px;
    font-family: "Poppins", sans-serif;
  }
  .social-wrapper .icon {
    position: relative;
    background: #fff;
    border-radius: 50%;
    width: 46px;
    height: 46px;
    font-size: 18px;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    color: #64748b;
    text-decoration: none;
  }
  .social-wrapper .tooltip {
    position: absolute;
    top: 0;
    font-size: 12px;
    font-weight: 600;
    background: #fff;
    color: #fff;
    padding: 4px 8px;
    border-radius: 5px;
    box-shadow: 0 6px 10px rgba(0, 0, 0, 0.1);
    opacity: 0;
    pointer-events: none;
    transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    white-space: nowrap;
  }
  .social-wrapper .tooltip::before {
    position: absolute;
    content: "";
    height: 8px;
    width: 8px;
    background: #fff;
    bottom: -3px;
    left: 50%;
    transform: translate(-50%) rotate(45deg);
    transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  }
  .social-wrapper .icon:hover .tooltip {
    top: -42px;
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
  }
  .social-wrapper .icon:hover span,
  .social-wrapper .icon:hover .tooltip {
    text-shadow: 0px -1px 0px rgba(0,0,0,0.1);
  }

  /* GitHub */
  .social-wrapper .icon.github:hover,
  .social-wrapper .icon.github:hover .tooltip,
  .social-wrapper .icon.github:hover .tooltip::before {
    background: #181717; color: #fff;
  }
  /* LinkedIn */
  .social-wrapper .icon.linkedin:hover,
  .social-wrapper .icon.linkedin:hover .tooltip,
  .social-wrapper .icon.linkedin:hover .tooltip::before {
    background: #0A66C2; color: #fff;
  }
  /* Facebook */
  .social-wrapper .icon.facebook:hover,
  .social-wrapper .icon.facebook:hover .tooltip,
  .social-wrapper .icon.facebook:hover .tooltip::before {
    background: #1877F2; color: #fff;
  }
  /* Instagram */
  .social-wrapper .icon.instagram:hover,
  .social-wrapper .icon.instagram:hover .tooltip,
  .social-wrapper .icon.instagram:hover .tooltip::before {
    background: #E4405F; color: #fff;
  }
`;

type SocialLink = { id: string; name: string; url: string };

const socialIcons: Record<string, { svgPath: string; viewBox?: string; label: string }> = {
  github: {
    label: "GitHub",
    viewBox: "0 0 24 24",
    svgPath: "M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z",
  },
  linkedin: {
    label: "LinkedIn",
    viewBox: "0 0 24 24",
    svgPath: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  },
  facebook: {
    label: "Facebook",
    viewBox: "0 0 320 512",
    svgPath: "M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z",
  },
  instagram: {
    label: "Instagram",
    viewBox: "0 0 16 16",
    svgPath: "M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z",
  },
};

export function SocialLinks({ socials }: { socials: SocialLink[] }) {
  return (
    <>
      <style>{socialStyles}</style>
      <ul className="social-wrapper">
        {socials.map((social) => {
          const key = social.name.toLowerCase();
          const iconData = socialIcons[key];
          if (!iconData) return null;
          return (
            <li key={social.id}>
              <Link
                href={social.url}
                target="_blank"
                aria-label={social.name}
                className={`icon ${key}`}
              >
                <span className="tooltip">{iconData.label}</span>
                <svg
                  viewBox={iconData.viewBox ?? "0 0 24 24"}
                  height="1.2em"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d={iconData.svgPath} />
                </svg>
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
