"use client";

import { useState, useEffect } from "react";
import { Container } from "@/components/ui/container";
import { projects, Project } from "@/data/site";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardTitle, CardDesc } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { FolderGit2, Calendar, Users, LayoutTemplate } from "lucide-react";
import { ProjectModal } from "@/components/ui/project-modal";

export default function ProjectsPage() {
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    // Prevent scrolling when modal is open
    useEffect(() => {
        if (selectedProject) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [selectedProject]);

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
        <section className="pt-10 sm:pt-14 pb-20 relative min-h-screen">
            <Container>
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="max-w-7xl mx-auto flex flex-col items-center sm:items-start"
                >
                    <motion.div variants={itemVariants} className="mb-14 max-w-3xl flex flex-col items-center text-center sm:items-start sm:text-left">
                        <div className="flex items-center gap-4 mb-5">
                            <div className="p-3.5 bg-cyan-500/10 rounded-2xl text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 shadow-sm">
                                <FolderGit2 className="w-8 h-8" />
                            </div>
                            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
                                Featured Projects
                            </h1>
                        </div>
                        <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
                            Khám phá các dự án tôi đã tham gia và xây dựng. Từ các trang web thương mại điện tử đến các hệ thống quản lý nội bộ. **Nhấn vào từng dự án** để xem thêm chi tiết về chức năng, giao diện và công nghệ.
                        </p>
                    </motion.div>

                    <motion.div variants={containerVariants} className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 w-full">
                        {projects.map((project, index) => (
                            <motion.div
                                variants={itemVariants}
                                key={project.slug}
                                className="h-full cursor-pointer group"
                                onClick={() => setSelectedProject(project)}
                            >
                                <Card className="h-full flex flex-col transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/20 hover:border-cyan-500/50 border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md relative overflow-hidden rounded-[2rem] z-10 p-1.5 hover:-translate-y-2">
                                    {/* Subtle Gradient Background */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-slate-900/5 dark:to-cyan-900/10 pointer-events-none -z-10" />

                                    {/* Image Container */}
                                    {project.image ? (
                                        <div className="relative w-full aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-slate-100 dark:bg-slate-800 isolate">
                                            <Image
                                                src={project.image}
                                                alt={project.name}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500 z-10" />
                                        </div>
                                    ) : (
                                        <div className="relative w-full aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-slate-100 dark:bg-slate-800 flex items-center justify-center isolate">
                                            <LayoutTemplate className="w-16 h-16 text-slate-300 dark:text-slate-700" />
                                        </div>
                                    )}

                                    <div className="p-5 md:p-6 flex flex-col h-full relative z-20">
                                        <CardTitle className="text-xl sm:text-2xl font-black tracking-tight flex flex-col gap-2 text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors leading-snug">
                                            <span className="line-clamp-2">{project.name}</span>
                                        </CardTitle>

                                        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mt-3 text-[12px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                                            {project.duration && (
                                                <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/50 px-2 py-1 rounded-md">
                                                    <Calendar className="w-3.5 h-3.5 text-cyan-500" />
                                                    <span>{project.duration}</span>
                                                </div>
                                            )}
                                            {project.teamSize && (
                                                <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/50 px-2 py-1 rounded-md">
                                                    <Users className="w-3.5 h-3.5 text-cyan-500" />
                                                    <span>{project.teamSize}</span>
                                                </div>
                                            )}
                                        </div>

                                        <CardDesc className="mt-4 flex-grow line-clamp-2 text-slate-600 dark:text-slate-400 font-medium leading-relaxed text-[15px]">
                                            {project.summary}
                                        </CardDesc>

                                        <div className="mt-6 flex flex-wrap gap-2 block">
                                            {project.stack.slice(0, 3).map((s) => (
                                                <Badge key={s} className="bg-slate-100 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 shadow-sm px-3 py-1 text-[11px] font-bold rounded-lg border border-slate-200 dark:border-slate-700/50">
                                                    {s}
                                                </Badge>
                                            ))}
                                            {project.stack.length > 3 && (
                                                <Badge className="bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-500 font-black rounded-lg border border-transparent shadow-none px-2 text-[11px]">
                                                    +{project.stack.length - 3}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
            </Container>

            <ProjectModal
                selectedProject={selectedProject}
                onClose={() => setSelectedProject(null)}
            />
        </section>
    );
}

