import {
  SiJavascript, SiTypescript, SiReact, SiHtml5, SiCss3,
  SiTailwindcss, SiDotnet, SiSpring, SiSpringboot,
  SiMysql, SiPostgresql, SiMongodb, SiRedis, SiFirebase,
  SiGit, SiGithub, SiDocker, SiPostman,
  SiFigma, SiAdobephotoshop, SiAdobeillustrator, SiCanva,
  SiNextdotjs, SiNodedotjs,
  SiBootstrap, SiJquery, SiVuedotjs, SiAngular, SiPython, SiFlutter, SiAmazon,
} from "react-icons/si";
import { TbBrandCSharp, TbBrandVscode, TbBrandVisualStudio, TbFileTypeSql } from "react-icons/tb";
import { FaJava, FaPhp } from "react-icons/fa";
import type { IconType } from "react-icons";
import { cn } from "@/lib/cn";

const techIconMap: Record<string, { icon: IconType; color: string }> = {
  "javascript": { icon: SiJavascript, color: "#F7DF1E" },
  "typescript": { icon: SiTypescript, color: "#3178C6" },
  "reactjs": { icon: SiReact, color: "#61DAFB" },
  "react": { icon: SiReact, color: "#61DAFB" },
  "html & css": { icon: SiHtml5, color: "#E34F26" },
  "html": { icon: SiHtml5, color: "#E34F26" },
  "css": { icon: SiCss3, color: "#1572B6" },
  "tailwindcss": { icon: SiTailwindcss, color: "#06B6D4" },
  "tailwind css": { icon: SiTailwindcss, color: "#06B6D4" },
  "bootstrap": { icon: SiBootstrap, color: "#7952B3" },
  "jquery": { icon: SiJquery, color: "#0769AD" },
  "vue": { icon: SiVuedotjs, color: "#42B883" },
  "vuejs": { icon: SiVuedotjs, color: "#42B883" },
  "angular": { icon: SiAngular, color: "#DD0031" },
  "next.js": { icon: SiNextdotjs, color: "#000000" },
  "nextjs": { icon: SiNextdotjs, color: "#000000" },
  "node.js": { icon: SiNodedotjs, color: "#339933" },
  "nodejs": { icon: SiNodedotjs, color: "#339933" },
  "c#/.net": { icon: TbBrandCSharp, color: "#512BD4" },
  "c#": { icon: TbBrandCSharp, color: "#512BD4" },
  "asp.net mvc": { icon: SiDotnet, color: "#512BD4" },
  "asp.net core": { icon: SiDotnet, color: "#512BD4" },
  "asp.net": { icon: SiDotnet, color: "#512BD4" },
  "entity framework": { icon: SiDotnet, color: "#512BD4" },
  "razor": { icon: SiDotnet, color: "#512BD4" },
  "java": { icon: FaJava, color: "#ED8B00" },
  "spring": { icon: SiSpring, color: "#6DB33F" },
  "springboot": { icon: SiSpringboot, color: "#6DB33F" },
  "jsp/servlet": { icon: FaJava, color: "#ED8B00" },
  "jsp/jstl": { icon: FaJava, color: "#ED8B00" },
  "php": { icon: FaPhp, color: "#777BB4" },
  "python": { icon: SiPython, color: "#3776AB" },
  "flutter": { icon: SiFlutter, color: "#02569B" },
  "mysql": { icon: SiMysql, color: "#4479A1" },
  "sql server": { icon: TbFileTypeSql, color: "#CC2927" },
  "mongodb": { icon: SiMongodb, color: "#47A248" },
  "postgresql": { icon: SiPostgresql, color: "#4169E1" },
  "firebase": { icon: SiFirebase, color: "#FFCA28" },
  "redis": { icon: SiRedis, color: "#DC382D" },
  "aws": { icon: SiAmazon, color: "#FF9900" },
  "git & github": { icon: SiGithub, color: "#181717" },
  "git": { icon: SiGit, color: "#F05032" },
  "github": { icon: SiGithub, color: "#181717" },
  "vs code": { icon: TbBrandVscode, color: "#007ACC" },
  "vscode": { icon: TbBrandVscode, color: "#007ACC" },
  "visual studio": { icon: TbBrandVisualStudio, color: "#5C2D91" },
  "postman": { icon: SiPostman, color: "#FF6C37" },
  "docker": { icon: SiDocker, color: "#2496ED" },
  "figma": { icon: SiFigma, color: "#F24E1E" },
  "photoshop": { icon: SiAdobephotoshop, color: "#31A8FF" },
  "illustrator": { icon: SiAdobeillustrator, color: "#FF9A00" },
  "canva": { icon: SiCanva, color: "#00C4CC" },
};

export function getTechIcon(name: string) {
  const key = name.toLowerCase().trim();
  return techIconMap[key] ?? null;
}

export function TechBadge({ name, className = "" }: { name: string; className?: string }) {
  const tech = getTechIcon(name);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200",
        "dark:bg-slate-800/80 dark:text-slate-300 dark:border-slate-700",
        className
      )}
    >
      {tech ? (
        <tech.icon style={{ color: tech.color }} className="w-3.5 h-3.5 flex-shrink-0" />
      ) : null}
      {name}
    </span>
  );
}
