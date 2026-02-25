"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/common/page-header";

import {
  SiPostman,
  SiAdobephotoshop,
  SiAdobeillustrator,
  SiCanva,
  SiFigma
} from "react-icons/si";

import {
  FaJava,
  FaGitAlt,
  FaGithub,
  FaDatabase,
  FaReact,
  FaMicrosoft
} from "react-icons/fa6";

import {
  TbBrandCSharp,
  TbBrandJavascript,
  TbBrandHtml5,
  TbBrandCss3,
  TbBrandVscode,
  TbBrandVisualStudio,
  TbBrandTypescript,
  TbBrandTailwind,
  TbBrandMysql
} from "react-icons/tb";

import { Wrench, Code2, Server, LayoutTemplate, PenTool } from "lucide-react";

const skillCategories = [
  {
    title: "Frontend Development",
    icon: LayoutTemplate,
    description: "Building responsive and dynamic user interfaces.",
    color: "text-blue-500",
    bgHover: "hover:shadow-blue-500/10 hover:border-blue-500/30 group-hover:bg-blue-50 dark:group-hover:bg-blue-950/50",
    skills: [
      { name: "JavaScript", icon: TbBrandJavascript, color: "text-yellow-400", desc: "Core language for web interactivity. Used extensively across all projects." },
      { name: "TypeScript", icon: TbBrandTypescript, color: "text-blue-500", desc: "My primary language. Used in QLSV Admin, Microservices for type-safe code." },
      { name: "ReactJS", icon: FaReact, color: "text-cyan-400", desc: "Base library for UI. Used alongside Next.js for SSR and performance optimization." },
      { name: "HTML & CSS", icon: TbBrandHtml5, color: "text-orange-500", desc: "The foundational building blocks. I write semantic HTML and modular CSS." },
      { name: "TailwindCSS", icon: TbBrandTailwind, color: "text-teal-400", desc: "My go-to styling framework. Used to quickly build premium UIs like this portfolio." },
    ]
  },
  {
    title: "Backend & Database",
    icon: Server,
    description: "Architecting robust APIs, services, and handling data.",
    color: "text-emerald-500",
    bgHover: "hover:shadow-emerald-500/10 hover:border-emerald-500/30 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-950/50",
    skills: [
      { name: "C#/.NET", icon: TbBrandCSharp, color: "text-purple-600", desc: "Familiar with ASP.NET Core for building enterprise-level REST APIs." },
      { name: "Java", icon: FaJava, color: "text-red-500", desc: "Learned at university, capable of building OOP-based system logic." },
      { name: "ASP.NET MVC", icon: FaMicrosoft, color: "text-purple-500", desc: "Used for building monolithic web applications during coursework." },
      { name: "Entity Framework", icon: FaDatabase, color: "text-blue-400", desc: "Primary ORM used alongside C# for executing database queries securely." },
      { name: "SQL Server", icon: FaDatabase, color: "text-red-600", desc: "Experience writing complex relational queries and stored procedures." },
      { name: "MySQL", icon: TbBrandMysql, color: "text-blue-500", desc: "Lightweight relational DB used in quick MVPs and personal deployments." },
    ]
  },
  {
    title: "Development Tools",
    icon: Code2,
    description: "Version control, IDEs, and API testing platforms.",
    color: "text-amber-500",
    bgHover: "hover:shadow-amber-500/10 hover:border-amber-500/30 group-hover:bg-amber-50 dark:group-hover:bg-amber-950/50",
    skills: [
      { name: "Git & GitHub", icon: FaGithub, color: "text-neutral-800 dark:text-neutral-200", desc: "Proficient with branching, PRs, and team collaboration workflows." },
      { name: "VS Code", icon: TbBrandVscode, color: "text-blue-500", desc: "My preferred lightweight editor for all JavaScript/TypeScript work." },
      { name: "Visual Studio", icon: TbBrandVisualStudio, color: "text-purple-600", desc: "Used for comprehensive C# and .NET enterprise development." },
      { name: "Postman", icon: SiPostman, color: "text-orange-500", desc: "Crucial for documenting, designing, and testing RESTful APIs." },
      { name: "DBDiagram", icon: FaDatabase, color: "text-teal-500", desc: "Visual tool for architecting and sharing complex database schemas." },
    ]
  },
  {
    title: "Design & Creative",
    icon: PenTool,
    description: "Creating wireframes, mockups, and visual assets.",
    color: "text-fuchsia-500",
    bgHover: "hover:shadow-fuchsia-500/10 hover:border-fuchsia-500/30 group-hover:bg-fuchsia-50 dark:group-hover:bg-fuchsia-950/50",
    skills: [
      { name: "Photoshop", icon: SiAdobephotoshop, color: "text-blue-600", desc: "Image editing, manipulation, and preparing assets for the web." },
      { name: "Illustrator", icon: SiAdobeillustrator, color: "text-orange-600", desc: "Vector graphics creation, used for scalable logos and clean SVGs." },
      { name: "Figma", icon: SiFigma, color: "text-pink-500", desc: "My main tool for UI/UX wireframing, prototyping, and design handoff." },
      { name: "Canva", icon: SiCanva, color: "text-cyan-500", desc: "Rapid creation of social media posts, banners, and quick presentations." },
    ]
  }
];

export default function SkillsToolsPage() {
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
    <section className="pt-10 sm:pt-14 pb-16 min-h-screen relative bg-white dark:bg-[#0a0a0a]">
      <Container>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="max-w-6xl mx-auto"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-16 sm:mb-20">
            <div className="inline-flex items-center justify-center p-3 sm:p-4 bg-neutral-100 dark:bg-neutral-800 rounded-3xl text-neutral-900 dark:text-neutral-100 mb-6 border border-neutral-200 dark:border-neutral-800 shadow-sm">
              <Wrench className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6 pb-2">
              <span className="text-neutral-900 dark:text-neutral-100">Skills</span>
              <span className="text-neutral-400 dark:text-neutral-600 mx-2">&</span>
              <span className="text-cyan-600 dark:text-cyan-400">Tools</span>
            </h1>
            <p className="text-lg text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed font-medium">
              A showcase of my frequently used skills, frameworks, databases, and design tools across different stacks.
            </p>
          </motion.div>

          {/* Skill Categories */}
          <motion.div variants={itemVariants} className="space-y-8 lg:space-y-12">
            {skillCategories.map((category, idx) => (
              <Card key={idx} className={`p-6 sm:p-8 lg:p-10 transition-all duration-300 bg-white dark:bg-neutral-900 shadow-sm border border-neutral-200 dark:border-neutral-800 hover:shadow-md hover:border-neutral-300 dark:hover:border-neutral-700 group`}>
                <div className="flex flex-col md:flex-row gap-6 lg:gap-12">

                  {/* Category Info */}
                  <div className="md:w-1/3 flex-shrink-0">
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`p-3 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-2xl text-neutral-900 dark:text-white transition-colors duration-300 group-hover:bg-neutral-200 dark:group-hover:bg-neutral-700`}>
                        <category.icon className="w-6 h-6" />
                      </div>
                      <h3 className="text-2xl font-bold text-neutral-900 dark:text-white transition-colors duration-300">{category.title}</h3>
                    </div>
                    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed font-medium">
                      {category.description}
                    </p>
                  </div>

                  {/* Skills List */}
                  <div className="md:w-2/3 grid sm:grid-cols-2 gap-4 lg:gap-6">
                    {category.skills.map((skill, sIdx) => (
                      <div key={sIdx} className="group/skill flex items-start gap-4 p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-800 hover:bg-white dark:hover:bg-neutral-800 hover:border-neutral-200 dark:hover:border-neutral-700 hover:shadow-sm transition-all duration-300">
                        <div className="flex-shrink-0 pt-1">
                          <skill.icon className={`w-8 h-8 transition-transform duration-300 group-hover/skill:scale-110 ${skill.color} drop-shadow-sm`} />
                        </div>
                        <div>
                          <h4 className="text-base font-bold text-neutral-900 dark:text-neutral-100 mb-1 group-hover/skill:text-cyan-600 dark:group-hover/skill:text-cyan-400 transition-colors">
                            {skill.name}
                          </h4>
                          <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed group-hover/skill:text-neutral-600 dark:group-hover/skill:text-neutral-300 transition-colors">
                            {skill.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              </Card>
            ))}
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
