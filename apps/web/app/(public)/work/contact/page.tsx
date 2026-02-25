"use client";

import { useState } from "react";
import { Container } from "@/components/ui/container";
import Link from "next/link";
import { site } from "@/data/site";
import { motion } from "framer-motion";
import { Send, MapPin, Clock, Mail, Linkedin, Github, MessageSquare, Check } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function ContactPage() {
    const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus("submitting");

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    subject: formData.subject || "Liên hệ từ Website",
                    message: formData.message,
                }),
            });
            const data = await res.json();

            if (data.success) {
                setStatus("success");
                setFormData({ name: "", email: "", subject: "", message: "" });
                setTimeout(() => setStatus("idle"), 4000);
            } else {
                console.error("Form submission failed:", data);
                setStatus("error");
                setTimeout(() => setStatus("idle"), 3000);
            }
        } catch (error) {
            console.error("Form submission error:", error);
            setStatus("error");
            setTimeout(() => setStatus("idle"), 3000);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

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
        <section className="pt-10 sm:pt-14 pb-16 min-h-screen relative">
            <Container>
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="max-w-5xl mx-auto"
                >
                    <motion.div variants={itemVariants} className="text-center mb-16">
                        <div className="inline-flex items-center justify-center p-3 sm:p-4 bg-cyan-100 dark:bg-cyan-900/40 rounded-3xl text-cyan-600 dark:text-cyan-400 mb-6 shadow-sm">
                            <MessageSquare className="w-8 h-8 sm:w-10 sm:h-10" />
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100 mb-6">
                            Let's Talk
                        </h1>
                        <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed">
                            All information here is for professional purposes only. Thank you for using this information responsibly. If you have any questions, feel free to send a direct message!
                        </p>
                    </motion.div>

                    <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
                        {/* Info & Social Layout */}
                        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">

                            {/* Contact Info Card */}
                            <Card className="p-6 transition-all duration-500 hover:shadow-xl hover:shadow-cyan-500/10 hover:border-cyan-500/30 bg-white/60 dark:bg-neutral-900/60 backdrop-blur-xl group">
                                <h3 className="text-xl font-bold mb-6 text-neutral-900 dark:text-neutral-100 group-hover:text-cyan-600 transition-colors">
                                    Contact Information
                                </h3>
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="p-2.5 bg-neutral-100 dark:bg-neutral-800 rounded-xl text-neutral-600 dark:text-neutral-400 group-hover:bg-cyan-50 group-hover:text-cyan-600 transition-colors">
                                            <MapPin className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mb-1">Address</p>
                                            <p className="text-sm text-neutral-600 dark:text-neutral-400 font-medium">{site.location}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="p-2.5 bg-neutral-100 dark:bg-neutral-800 rounded-xl text-neutral-600 dark:text-neutral-400 group-hover:bg-cyan-50 group-hover:text-cyan-600 transition-colors">
                                            <Clock className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mb-1">Timezone</p>
                                            <p className="text-sm text-neutral-600 dark:text-neutral-400 font-medium">{site.timezone}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="p-2.5 bg-neutral-100 dark:bg-neutral-800 rounded-xl text-neutral-600 dark:text-neutral-400 group-hover:bg-cyan-50 group-hover:text-cyan-600 transition-colors">
                                            <Mail className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mb-1">Email</p>
                                            <Link href={`mailto:${site.email}`} className="text-sm text-cyan-600 hover:text-cyan-700 hover:underline font-semibold transition-colors">
                                                {site.email}
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            {/* Social Media Card */}
                            <Card className="p-6 transition-all duration-500 hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-500/30 bg-white/60 dark:bg-neutral-900/60 backdrop-blur-xl group">
                                <h3 className="text-xl font-bold mb-6 text-neutral-900 dark:text-neutral-100 group-hover:text-blue-600 transition-colors">
                                    Social Media
                                </h3>
                                <div className="space-y-4">
                                    <Link
                                        href={site.links.linkedin}
                                        target="_blank"
                                        className="flex items-center gap-4 p-3 rounded-2xl hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors group/link"
                                    >
                                        <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl group-hover/link:scale-110 transition-transform">
                                            <Linkedin className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100">LinkedIn</p>
                                            <p className="text-xs text-neutral-500 font-medium">Professional Network</p>
                                        </div>
                                    </Link>
                                    <Link
                                        href={site.links.github}
                                        target="_blank"
                                        className="flex items-center gap-4 p-3 rounded-2xl hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors group/link"
                                    >
                                        <div className="p-2.5 bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 rounded-xl group-hover/link:scale-110 transition-transform">
                                            <Github className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100">GitHub</p>
                                            <p className="text-xs text-neutral-500 font-medium">View Source Code</p>
                                        </div>
                                    </Link>
                                    <Link
                                        href={site.links.facebook}
                                        target="_blank"
                                        className="flex items-center gap-4 p-3 rounded-2xl hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors group/link"
                                    >
                                        <div className="p-2.5 bg-blue-50 text-blue-500 rounded-xl group-hover/link:scale-110 transition-transform">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100">Facebook</p>
                                            <p className="text-xs text-neutral-500 font-medium">Social Profile</p>
                                        </div>
                                    </Link>
                                    <Link
                                        href={site.links.instagram}
                                        target="_blank"
                                        className="flex items-center gap-4 p-3 rounded-2xl hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors group/link"
                                    >
                                        <div className="p-2.5 bg-pink-50 text-pink-500 rounded-xl group-hover/link:scale-110 transition-transform">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100">Instagram</p>
                                            <p className="text-xs text-neutral-500 font-medium">Visual Gallery</p>
                                        </div>
                                    </Link>
                                </div>

                            </Card>

                        </motion.div>

                        {/* Direct Message Form Layout */}
                        <motion.div variants={itemVariants} className="lg:col-span-3">
                            <Card className="p-8 sm:p-10 h-full transition-all duration-500 bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] rounded-2xl relative overflow-hidden group">
                                {/* Decorative circle */}
                                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500 pointer-events-none scale-[2.5] -translate-y-12 translate-x-12">
                                    <Send className="w-40 h-40 text-cyan-500" strokeWidth={1} />
                                </div>

                                <h3 className="text-3xl font-extrabold mb-1.5 text-neutral-900 dark:text-neutral-100 tracking-tight">Send a Message</h3>
                                <p className="mb-10 text-neutral-500 dark:text-neutral-400 text-[15px] font-medium">Opens your default email client to send a direct email.</p>

                                <form className="flex flex-col gap-6 flex-grow relative z-10" onSubmit={handleSubmit}>
                                    <div className="grid gap-6 sm:grid-cols-2">
                                        <div className="flex flex-col gap-2.5">
                                            <label htmlFor="name" className="text-[15px] font-bold text-neutral-800 dark:text-neutral-200">Full Name</label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                required
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="rounded-xl border border-neutral-200/80 bg-white/50 px-4 py-3.5 text-[15px] text-neutral-900 transition-all duration-300 focus:border-cyan-500 focus:outline-none focus:ring-4 focus:ring-cyan-500/10 dark:border-neutral-800 dark:bg-neutral-950/50 dark:text-neutral-100 dark:focus:ring-cyan-500/20 font-medium placeholder:text-neutral-400"
                                                placeholder="Your Name"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2.5">
                                            <label htmlFor="email" className="text-[15px] font-bold text-neutral-800 dark:text-neutral-200">Email</label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                required
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="rounded-xl border border-neutral-200/80 bg-white/50 px-4 py-3.5 text-[15px] text-neutral-900 transition-all duration-300 focus:border-cyan-500 focus:outline-none focus:ring-4 focus:ring-cyan-500/10 dark:border-neutral-800 dark:bg-neutral-950/50 dark:text-neutral-100 dark:focus:ring-cyan-500/20 font-medium placeholder:text-neutral-400"
                                                placeholder="email@example.com"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2.5">
                                        <label htmlFor="subject" className="text-[15px] font-bold text-neutral-800 dark:text-neutral-200">Subject</label>
                                        <input
                                            type="text"
                                            id="subject"
                                            name="subject"
                                            required
                                            value={formData.subject}
                                            onChange={handleChange}
                                            className="rounded-xl border border-neutral-200/80 bg-white/50 px-4 py-3.5 text-[15px] text-neutral-900 transition-all duration-300 focus:border-cyan-500 focus:outline-none focus:ring-4 focus:ring-cyan-500/10 dark:border-neutral-800 dark:bg-neutral-950/50 dark:text-neutral-100 dark:focus:ring-cyan-500/20 font-medium placeholder:text-neutral-400"
                                            placeholder="Example: Project Collaboration Inquiry"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2.5">
                                        <label htmlFor="message" className="text-[15px] font-bold text-neutral-800 dark:text-neutral-200">Message</label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            rows={5}
                                            required
                                            value={formData.message}
                                            onChange={handleChange}
                                            className="resize-none rounded-xl border border-neutral-200/80 bg-white/50 px-4 py-4 text-[15px] text-neutral-900 transition-all duration-300 focus:border-cyan-500 focus:outline-none focus:ring-4 focus:ring-cyan-500/10 dark:border-neutral-800 dark:bg-neutral-950/50 dark:text-neutral-100 dark:focus:ring-cyan-500/20 font-medium placeholder:text-neutral-400"
                                            placeholder="What would you like to discuss?"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={status === "submitting" || status === "success"}
                                        className="mt-4 w-full sm:w-auto self-end group inline-flex items-center justify-center gap-2.5 rounded-xl bg-[#0f172a] px-8 py-3.5 text-[15px] font-bold text-white transition-all duration-300 hover:bg-cyan-600 hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-500/25 active:scale-95 disabled:opacity-70 disabled:pointer-events-none dark:bg-white dark:text-neutral-900 dark:hover:bg-cyan-500 dark:hover:text-white"
                                    >
                                        {status === "submitting" ? (
                                            <>
                                                <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin dark:border-neutral-900/20 dark:border-t-neutral-900" />
                                                Đang gửi...
                                            </>
                                        ) : status === "success" ? (
                                            <>
                                                <Check className="h-4 w-4" />
                                                Gửi thành công!
                                            </>
                                        ) : status === "error" ? (
                                            <>
                                                Gửi thất bại, thử lại!
                                            </>
                                        ) : (
                                            <>
                                                Gửi tin nhắn
                                                <Send className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                                            </>
                                        )}
                                    </button>
                                </form>
                            </Card>
                        </motion.div>
                    </div>
                </motion.div>
            </Container>
        </section>
    );
}
