"use client";

import { useState, useEffect } from "react";
import { Container } from "@/components/ui/container";
import { projects, Project } from "@/data/site";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardTitle, CardDesc } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
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
                    className="max-w-6xl mx-auto"
                >
                    <motion.div variants={itemVariants} className="mb-12 max-w-3xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-cyan-100 dark:bg-cyan-900/40 rounded-2xl text-cyan-600 dark:text-cyan-400">
                                <FolderGit2 className="w-8 h-8" />
                            </div>
                            <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100">
                                Projects
                            </h1>
                        </div>
                        <p className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">
                            Khám phá các dự án tôi đã tham gia và xây dựng. Từ các trang web thương mại điện tử đến các hệ thống quản lý nội bộ. **Nhấn vào từng dự án** để xem thêm chi tiết về công nghệ, công cụ, cấu trúc đội nhóm và các tính năng chính.
                        </p>
                    </motion.div>

                    <motion.div variants={containerVariants} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {projects.map((project) => (
                            <motion.div
                                variants={itemVariants}
                                key={project.slug}
                                className="h-full cursor-pointer group"
                                onClick={() => setSelectedProject(project)}
                            >
                                <Card className="h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/10 hover:border-cyan-500/50 hover:-translate-y-2 relative overflow-hidden bg-white/60 dark:bg-neutral-900/60 backdrop-blur-xl">
                                    <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-10 transition-all duration-500 pointer-events-none scale-150 -translate-y-4 translate-x-4">
                                        <LayoutTemplate className="w-24 h-24 text-cyan-500" />
                                    </div>
                                    <CardTitle className="group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors text-xl font-bold flex flex-col gap-2">
                                        <span className="line-clamp-2">{project.name}</span>
                                    </CardTitle>

                                    <div className="flex items-center gap-4 mt-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                                        {project.duration && (
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="w-3.5 h-3.5" />
                                                <span>{project.duration}</span>
                                            </div>
                                        )}
                                        {project.teamSize && (
                                            <div className="flex items-center gap-1.5">
                                                <Users className="w-3.5 h-3.5" />
                                                <span>{project.teamSize}</span>
                                            </div>
                                        )}
                                    </div>

                                    <CardDesc className="mt-4 flex-grow line-clamp-3 text-neutral-500 dark:text-neutral-400 font-medium leading-relaxed">
                                        {project.summary}
                                    </CardDesc>

                                    <div className="mt-6 flex flex-wrap gap-2">
                                        {project.stack.slice(0, 3).map((s) => (
                                            <Badge key={s} className="bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors">
                                                {s}
                                            </Badge>
                                        ))}
                                        {project.stack.length > 3 && (
                                            <Badge className="bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                                                +{project.stack.length - 3}
                                            </Badge>
                                        )}
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
