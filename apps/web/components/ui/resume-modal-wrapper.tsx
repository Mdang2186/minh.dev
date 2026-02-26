"use client";

import dynamic from "next/dynamic";

const DynamicResumeModal = dynamic(
    () => import("@/components/ui/resume-modal").then(mod => mod.ResumeModal),
    { ssr: false }
);

export function ResumeModalWrapper({ resumeUrl }: { resumeUrl: string }) {
    return <DynamicResumeModal resumeUrl={resumeUrl} />;
}
