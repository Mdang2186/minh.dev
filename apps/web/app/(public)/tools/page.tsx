"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import {
  Code2,
  Database,
  LayoutTemplate,
  Terminal,
  Wrench,
  Clock,
  WholeWord,
  Layers,
  Server,
  Cpu,
  Sparkles
} from "lucide-react";

// Types
type Skill = {
  name: string;
  icon: any;
  color: string;
};

type Category = {
  title: string;
  icon: any;
  description: string;
  skills: Skill[];
};

// Data
const skillCategories: Category[] = [
  {
    title: "Frontend Development",
    icon: LayoutTemplate,
    description: "Building responsive and accessible user interfaces.",
    skills: [
      { name: "React / Next.js", icon: Code2, color: "text-sky-500" },
      { name: "TypeScript", icon: Code2, color: "text-blue-500" },
      { name: "Tailwind CSS", icon: Layers, color: "text-cyan-400" },
      { name: "Framer Motion", icon: Sparkles, color: "text-fuchsia-500" },
    ]
  },
  {
    title: "Backend & Systems",
    icon: Server,
    description: "Architecting robust APIs and microservices.",
    skills: [
      { name: "Node.js / Express", icon: Terminal, color: "text-green-500" },
      { name: "NestJS", icon: Server, color: "text-red-500" },
      { name: "Prisma ORM", icon: Database, color: "text-indigo-500" },
      { name: "PostgreSQL", icon: Database, color: "text-blue-400" },
    ]
  },
  {
    title: "DevOps & Tools",
    icon: Wrench,
    description: "Ensuring smooth deployments and team collaboration.",
    skills: [
      { name: "Git / GitHub", icon: Terminal, color: "text-neutral-500 dark:text-neutral-300" },
      { name: "Docker", icon: Cpu, color: "text-blue-600" },
      { name: "Vercel", icon: Server, color: "text-neutral-900 dark:text-neutral-100" },
      { name: "Linux", icon: Terminal, color: "text-amber-500" },
    ]
  }
];

const miniTools = [
  {
    href: "/tools/ipa",
    name: "IPA Helper",
    desc: "Convert and translate inputs to IPA format instantly.",
    icon: WholeWord,
    color: "text-violet-500",
    bgHover: "hover:shadow-violet-500/10 hover:border-violet-500/30",
    iconBg: "bg-violet-100 dark:bg-violet-900/30"
  },
  {
    href: "/tools/clock",
    name: "Realtime Clock",
    desc: "A beautiful client-side realtime clock visualization.",
    icon: Clock,
    color: "text-emerald-500",
    bgHover: "hover:shadow-emerald-500/10 hover:border-emerald-500/30",
    iconBg: "bg-emerald-100 dark:bg-emerald-900/30"
  }
];

export default function SkillsAndToolsPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section className="pt-10 sm:pt-14 pb-16 min-h-screen relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

      <Container>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="max-w-6xl mx-auto"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-16 sm:mb-20">
            <div className="inline-flex items-center justify-center p-3 sm:p-4 bg-violet-100 dark:bg-violet-900/40 rounded-3xl text-violet-600 dark:text-violet-400 mb-6 shadow-sm">
              <Wrench className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100 mb-6">
              Skills <span className="text-neutral-400 dark:text-neutral-600">&</span> Tools
            </h1>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed">
              A showcase of my technical expertise, preferred tech stack, and a collection of handy mini-tools I've built.
            </p>
          </motion.div>

          {/* Skills Section */}
          <motion.div variants={itemVariants} className="mb-24">
            <div className="flex items-center gap-4 mb-10">
              <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">Technical Arsenal</h2>
              <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-800 hidden sm:block"></div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {skillCategories.map((category, idx) => (
                <Card key={idx} className="p-6 h-full transition-all duration-500 hover:shadow-xl hover:shadow-cyan-500/10 hover:border-cyan-500/30 bg-white/60 dark:bg-neutral-900/60 backdrop-blur-xl group">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-2xl text-neutral-700 dark:text-neutral-300 group-hover:bg-cyan-50 group-hover:text-cyan-600 dark:group-hover:bg-cyan-950/50 transition-colors duration-500">
                      <category.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">{category.title}</h3>
                  </div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6 line-clamp-2">
                    {category.description}
                  </p>
                  <div className="space-y-3">
                    {category.skills.map((skill, sIdx) => (
                      <div key={sIdx} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                        <div className={`p-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 ${skill.color}`}>
                          <skill.icon className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">{skill.name}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>

          {/* Tools Section */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center gap-4 mb-10">
              <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">Mini Tools</h2>
              <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-800 hidden sm:block"></div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6 lg:gap-8">
              {miniTools.map((tool, idx) => (
                <Link key={idx} href={tool.href} className="group outline-none">
                  <Card className={`p-6 sm:p-8 h-full transition-all duration-500 hover:shadow-xl bg-white/60 dark:bg-neutral-900/60 backdrop-blur-xl relative overflow-hidden ${tool.bgHover}`}>
                    {/* Background Decoration */}
                    <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-10 transition-opacity duration-500 pointer-events-none scale-150 -translate-y-4 translate-x-4">
                      <tool.icon className={`w-32 h-32 ${tool.color}`} />
                    </div>

                    <div className="flex items-start justify-between mb-6 relative z-10">
                      <div className={`p-4 rounded-2xl ${tool.iconBg} ${tool.color} group-hover:scale-110 transition-transform duration-500`}>
                        <tool.icon className="w-8 h-8" />
                      </div>
                      <div className="p-2 bg-neutral-100 dark:bg-neutral-800 rounded-full text-neutral-400 group-hover:bg-neutral-900 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-neutral-900 transition-colors">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14" />
                          <path d="m12 5 7 7-7 7" />
                        </svg>
                      </div>
                    </div>

                    <div className="relative z-10">
                      <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-3 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                        {tool.name}
                      </h3>
                      <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed font-medium">
                        {tool.desc}
                      </p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
