"use client";

import React from "react";
import { motion } from "framer-motion";
import { PublicTimelineNode, PublicSprint } from "@/features/portfolio/portfolio.types";
import { cn } from "@/lib/cn";
import * as LucideIcons from "lucide-react";
import Link from "next/link";

interface RoadmapTimelineProps {
  nodes: PublicTimelineNode[];
}

const PRESET_COLORS = ["#0ea5e9", "#8b5cf6", "#ec4899", "#14b8a6", "#f59e0b", "#ef4444"];

export function RoadmapTimeline({ nodes }: RoadmapTimelineProps) {
  // Sort nodes (Newest first)
  const sorted = [...nodes].sort((a, b) => {
    if (a.sortOrder !== undefined && b.sortOrder !== undefined && a.sortOrder !== b.sortOrder) {
      return b.sortOrder - a.sortOrder;
    }
    const ya = parseInt(a.date?.match(/\d{4}/)?.[0] ?? "0");
    const yb = parseInt(b.date?.match(/\d{4}/)?.[0] ?? "0");
    return yb - ya;
  });

  if (!sorted.length) return null;

  return (
    <section className="w-full py-12 md:py-20 overflow-hidden relative">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-slate-50 dark:bg-slate-950/50 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 md:mb-20 text-center relative z-10">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-4"
        >
          My <span className="text-cyan-600 dark:text-cyan-400">Journey</span>
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-sm sm:text-base md:text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium px-4"
        >
          The continuous evolution of my professional career, milestones, and achievements.
        </motion.p>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative">
        {/* Central Vertical Line */}
        <div className="absolute left-[24px] md:left-1/2 top-4 bottom-4 w-0.5 bg-gradient-to-b from-cyan-500/30 via-blue-500/30 to-purple-500/30 rounded-full md:-translate-x-1/2 z-0"></div>

        <div className="flex flex-col gap-6 md:gap-12 relative z-10">
          {sorted.map((node, i) => {
            const isEven = i % 2 === 0;
            const nodeColor = node.color || PRESET_COLORS[i % PRESET_COLORS.length];
            const IconComponent = node.icon && (LucideIcons as any)[node.icon]
              ? (LucideIcons as any)[node.icon]
              : LucideIcons.Star;

            let targetUrl = node.link;
            if (!targetUrl) {
              if (node.type === "EDUCATION") {
                targetUrl = "/work/education";
              } else if (node.project?.slug) {
                targetUrl = `/projects/${node.project.slug}`;
              } else if (node.type === "PROJECT" && node.projectId) {
                targetUrl = `/projects/${node.projectId}`; // fallback if slug is not available
              }
            }

            const CardWrapper = targetUrl ? Link : "div";
            const cardProps = targetUrl ? { href: targetUrl } : {};

            return (
              <motion.div
                key={node.id || i}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: 0.05 }}
                className={cn(
                  "relative flex w-full",
                  isEven ? "justify-start md:justify-start" : "justify-start md:justify-end"
                )}
              >
                {/* Node Icon on Timeline */}
                <div 
                  className="absolute left-[24px] md:left-1/2 top-6 md:top-1/2 w-10 h-10 md:w-12 md:h-12 bg-white dark:bg-slate-900 rounded-full border-[3px] border-slate-50 dark:border-slate-950 flex items-center justify-center z-20 shadow-lg -translate-x-1/2 md:-translate-y-1/2 transition-transform duration-500 hover:scale-110 hover:shadow-cyan-500/20"
                >
                  <div 
                    className="w-full h-full rounded-full flex items-center justify-center text-white shadow-inner"
                    style={{ backgroundColor: nodeColor }}
                  >
                    <IconComponent className="w-4 h-4 md:w-5 md:h-5" strokeWidth={2.5} />
                  </div>
                </div>

                <div className={cn(
                  "w-full md:w-1/2 pl-[60px] md:pl-0",
                  isEven ? "md:pr-[40px]" : "md:pl-[40px]"
                )}>
                  <CardWrapper 
                    {...cardProps}
                    className={cn(
                      "block bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm p-4 md:p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.15)] border border-slate-200/60 dark:border-slate-800 transition-all duration-300 group",
                      targetUrl ? "hover:-translate-y-1 hover:shadow-[0_15px_30px_rgb(0,0,0,0.08)] cursor-pointer" : ""
                    )}
                  >
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <span 
                        className="text-[10px] md:text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800/50"
                        style={{ color: nodeColor }}
                      >
                        {node.date}
                      </span>
                      {node.shortLabel && (
                        <span className="text-[10px] md:text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                          {node.shortLabel}
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-base md:text-lg font-black text-slate-800 dark:text-white mb-1.5 md:mb-2 leading-tight group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                      {node.title}
                    </h3>

                    {node.description && (
                      <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed font-medium">
                        {node.description}
                      </p>
                    )}

                    {node.sprints && node.sprints.length > 0 && (
                      <div className="mt-4 md:mt-5 pt-3 md:pt-4 border-t border-slate-100 dark:border-slate-800/60 flex flex-col gap-2.5">
                        {node.sprints.map((sprint: PublicSprint, idx: number) => (
                          <div key={idx} className="flex items-start gap-2.5">
                            <div className="p-0.5 rounded-full bg-slate-50 dark:bg-slate-800 mt-0.5">
                              <LucideIcons.Check className="w-3 h-3" style={{ color: nodeColor }} />
                            </div>
                            <div>
                              <span className="text-[12px] md:text-[13px] font-bold text-slate-700 dark:text-slate-300 block leading-snug">
                                {sprint.title}
                              </span>
                              {sprint.startDate && sprint.endDate && (
                                <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-0.5 font-semibold tracking-wide uppercase">
                                  {sprint.startDate} – {sprint.endDate}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardWrapper>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
