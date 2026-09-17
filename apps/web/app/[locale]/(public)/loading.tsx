"use client";

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/80 backdrop-blur-md">
      <style dangerouslySetInnerHTML={{
        __html: `
        .three-body {
          --uib-color: #0ea5e9; /* Sky 500 */
        }
      `}} />
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-col items-center gap-6"
      >
        <div className="three-body">
          <div className="three-body__dot"></div>
          <div className="three-body__dot"></div>
          <div className="three-body__dot"></div>
        </div>
        <div className="text-cyan-600 font-bold tracking-widest uppercase text-sm animate-pulse">
          Loading Data...
        </div>
      </motion.div>
    </div>
  );
}
