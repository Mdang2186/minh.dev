"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, FileText, ExternalLink, Download, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";

// Load required CSS for react-pdf
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Setup worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface ResumeModalProps {
    resumeUrl: string;
}

export function ResumeModal({ resumeUrl }: ResumeModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    const [numPages, setNumPages] = useState<number>();
    const [scale, setScale] = useState<number>(1);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Responsive scaling based on container size
    useEffect(() => {
        const updateScale = () => {
            if (containerRef.current) {
                const containerWidth = containerRef.current.clientWidth;
                // PDF default width is roughly 600px. Adjust scale to fit the container width.
                // Subtract some padding (e.g., 40px) from containerWidth
                const padding = window.innerWidth < 640 ? 32 : 64;
                const newScale = (containerWidth - padding) / 600;
                setScale(Math.min(newScale, 1.5)); // Map scale, max 1.5x
            }
        };

        if (isOpen) {
            updateScale();
            window.addEventListener("resize", updateScale);
        }
        return () => window.removeEventListener("resize", updateScale);
    }, [isOpen]);

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

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
    }

    const zoomIn = () => setScale(prev => Math.min(prev + 0.2, 2.5));
    const zoomOut = () => setScale(prev => Math.max(prev - 0.2, 0.5));

    const Loader = () => (
        <div className="flex flex-col items-center justify-center p-20 text-slate-500 w-full h-full min-h-[50vh]">
            <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <p className="font-medium animate-pulse">Loading Document...</p>
        </div>
    );

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-blue-600 hover:bg-blue-50 hover:text-blue-700 font-bold text-sm transition-all hover:-translate-y-0.5 border border-transparent hover:border-blue-100"
            >
                <FileText className="w-4 h-4 mr-1.5" />
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
                            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-0 sm:p-4 md:p-6"
                            onClick={() => setIsOpen(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                                className="relative w-full h-full sm:max-w-5xl sm:h-[90vh] bg-slate-50 sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Header */}
                                <div className="flex shrink-0 z-20 items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-200 bg-white">
                                    <h3 className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-2">
                                        <FileText className="w-5 h-5 text-blue-600" />
                                        <span className="hidden sm:inline">Resume</span>
                                    </h3>

                                    {/* Toolbar */}
                                    {numPages && (
                                        <div className="flex items-center gap-1 sm:gap-3 px-2 sm:px-4 py-1.5 bg-slate-100 rounded-full border border-slate-200">
                                            <button onClick={zoomOut} className="p-1 sm:p-1.5 rounded-full hover:bg-white text-slate-600 transition-colors hidden sm:block">
                                                <ZoomOut className="w-4 h-4 sm:w-5 sm:h-5" />
                                            </button>
                                            <span className="text-xs sm:text-sm font-medium text-slate-600 min-w-[2rem] text-center hidden sm:inline-block">
                                                {Math.round(scale * 100)}%
                                            </span>
                                            <button onClick={zoomIn} className="p-1 sm:p-1.5 rounded-full hover:bg-white text-slate-600 transition-colors hidden sm:block">
                                                <ZoomIn className="w-4 h-4 sm:w-5 sm:h-5" />
                                            </button>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-1 sm:gap-2">
                                        <a
                                            href={resumeUrl}
                                            download
                                            className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-2 sm:px-3 sm:py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
                                            title="Download Resume"
                                        >
                                            <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                                            <span className="hidden md:inline">Download</span>
                                        </a>
                                        <a
                                            href={resumeUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 p-2 sm:px-3 sm:py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
                                            title="Open in New Tab"
                                        >
                                            <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
                                            <span className="hidden lg:inline">Open in New Tab</span>
                                        </a>
                                        <div className="w-px h-6 bg-slate-200 mx-1 hidden sm:block"></div>
                                        <button
                                            onClick={() => setIsOpen(false)}
                                            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors bg-slate-100 sm:bg-transparent"
                                            aria-label="Close"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                {/* PDF Viewer */}
                                <div
                                    ref={containerRef}
                                    className="flex-1 w-full bg-slate-500/10 overflow-y-auto relative flex flex-col items-center py-4 sm:py-8"
                                >
                                    <Document
                                        file={resumeUrl}
                                        onLoadSuccess={onDocumentLoadSuccess}
                                        loading={<Loader />}
                                        className="flex flex-col items-center gap-8 w-full max-w-full px-4"
                                    >
                                        {Array.from(new Array(numPages || 0), (el, index) => (
                                            <div key={`page_wrapper_${index + 1}`} className="shadow-2xl flex-shrink-0">
                                                <Page
                                                    pageNumber={index + 1}
                                                    scale={scale}
                                                    renderTextLayer={true}
                                                    renderAnnotationLayer={true}
                                                    className="bg-white max-w-full"
                                                    loading={index === 0 ? <Loader /> : null}
                                                />
                                            </div>
                                        ))}
                                    </Document>
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
