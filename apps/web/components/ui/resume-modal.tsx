"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, FileText, ExternalLink } from "lucide-react";

interface ResumeModalProps {
    resumeUrl: string;
}

export function ResumeModal({ resumeUrl }: ResumeModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsOpen(false);
        };
        if (isOpen) {
            document.body.style.overflow = "hidden";
            window.addEventListener("keydown", handleKeyDown);
        } else {
            document.body.style.overflow = "auto";
        }
        return () => {
            document.body.style.overflow = "auto";
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen]);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="inline-flex items-center justify-center rounded-full px-6 py-4 text-blue-600 hover:bg-blue-50 hover:text-blue-700 font-bold text-[15px] transition-all hover:-translate-y-1 ml-2 border border-transparent hover:border-blue-100"
            >
                <FileText className="w-5 h-5 mr-2" />
                Resume
            </button>

            {mounted && createPortal(
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            key="resume-modal-overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 sm:p-6"
                            onClick={() => setIsOpen(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                                className="relative w-full max-w-5xl h-[85vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Header */}
                                <div className="flex z-10 items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
                                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                        <FileText className="w-5 h-5 text-blue-600" />
                                        Resume
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        <a
                                            href={resumeUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                            Open in New Tab
                                        </a>
                                        <div className="w-px h-6 bg-slate-200 mx-1"></div>
                                        <button
                                            onClick={() => setIsOpen(false)}
                                            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                                            aria-label="Close"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                {/* Iframe Viewer */}
                                <div className="flex-1 w-full bg-slate-100/50">
                                    <iframe
                                        src={`${resumeUrl}#toolbar=0`}
                                        className="w-full h-full border-none"
                                        title="Resume Document Viewer"
                                    />
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </>
    );
}
