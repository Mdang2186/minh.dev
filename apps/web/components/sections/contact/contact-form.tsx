"use client";

import { useState } from "react";
import { Check, Send, Paperclip } from "lucide-react";
import { useTranslations } from "next-intl";

export function ContactForm() {
  const t = useTranslations("ContactForm");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [file, setFile] = useState<File | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("subject", formData.subject || "Liên hệ từ Website");
      data.append("message", formData.message);
      if (file) {
        data.append("file", file);
      }

      const response = await fetch("/api/contact", {
        method: "POST",
        body: data,
      });
      const responseData = await response.json();
      if (responseData.success) {
        setStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
        setFile(null);
        setTimeout(() => setStatus("idle"), 4000);
      } else {
        setStatus("error");
        setTimeout(() => setStatus("idle"), 3000);
      }
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  }

  return (
    <form className="flex flex-col gap-3 sm:gap-3.5 flex-grow relative z-10 font-sans" onSubmit={handleSubmit}>
      <div className="grid gap-3 sm:grid-cols-2">
        <ContactInput label={t("fullName")} name="name" value={formData.name} onChange={handleChange} placeholder={t("fullNamePlaceholder")} />
        <ContactInput label={t("email")} name="email" type="email" value={formData.email} onChange={handleChange} placeholder={t("emailPlaceholder")} />
      </div>
      <ContactInput label={t("subject")} name="subject" value={formData.subject} onChange={handleChange} placeholder={t("subjectPlaceholder")} />
      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{t("message")}</span>
        <div className="relative flex flex-col rounded-lg border border-slate-200/90 bg-white/50 focus-within:border-cyan-500 focus-within:ring-2 focus-within:ring-cyan-500/10 dark:border-slate-800 dark:bg-slate-950/50 transition-all">
          <textarea
            name="message"
            rows={3}
            required
            value={formData.message}
            onChange={handleChange}
            className="resize-none w-full bg-transparent px-3 py-2 text-xs sm:text-[13px] text-slate-900 focus:outline-none dark:text-slate-100 font-medium placeholder:text-slate-400"
            placeholder={t("messagePlaceholder")}
          />
          <div className="flex items-center px-3 pb-2 gap-2">
            <label className="cursor-pointer text-slate-400 hover:text-cyan-600 transition-colors flex items-center gap-1" title="Attach JD or Document">
              <Paperclip className="w-4 h-4" />
              <input 
                type="file" 
                className="hidden" 
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </label>
            {file && (
              <span className="text-[11px] text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded truncate max-w-[180px] border border-slate-200 dark:border-slate-700">
                {file.name}
              </span>
            )}
          </div>
        </div>
      </label>
      <button
        type="submit"
        disabled={status === "submitting" || status === "success"}
        className="mt-2 w-full sm:w-auto self-end group inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-5 py-2 text-xs sm:text-[13px] font-bold text-white transition-all hover:bg-cyan-600 active:scale-95 disabled:opacity-70 disabled:pointer-events-none shadow-sm"
      >
        {status === "submitting" ? (
          <>
            <span className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            {t("submitting")}
          </>
        ) : status === "success" ? (
          <>
            <Check className="h-3.5 h-3.5 text-emerald-400" />
            {t("success")}
          </>
        ) : status === "error" ? (
          t("error")
        ) : (
          <>
            {t("submit")}
            <Send className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </>
        )}
      </button>
    </form>
  );
}

function ContactInput({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{label}</span>
      <input
        type={type}
        name={name}
        required
        value={value}
        onChange={onChange}
        className="rounded-lg border border-slate-200/90 bg-white/50 px-3 py-2 text-xs sm:text-[13px] text-slate-900 transition-all focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/10 dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-100 font-medium placeholder:text-slate-400"
        placeholder={placeholder}
      />
    </label>
  );
}
