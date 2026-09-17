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
    <form className="flex flex-col gap-4 sm:gap-5 flex-grow relative z-10 font-sans" onSubmit={handleSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <ContactInput label={t("fullName")} name="name" value={formData.name} onChange={handleChange} placeholder={t("fullNamePlaceholder")} />
        <ContactInput label={t("email")} name="email" type="email" value={formData.email} onChange={handleChange} placeholder={t("emailPlaceholder")} />
      </div>
      <ContactInput label={t("subject")} name="subject" value={formData.subject} onChange={handleChange} placeholder={t("subjectPlaceholder")} />
      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 ml-1">{t("message")}</span>
        <div className="relative flex flex-col rounded-xl border border-slate-200/80 bg-slate-50/50 focus-within:border-cyan-500 focus-within:ring-4 focus-within:ring-cyan-500/10 focus-within:bg-white dark:border-slate-800/80 dark:bg-slate-900/50 dark:focus-within:bg-slate-900 dark:focus-within:border-cyan-500/50 transition-all shadow-sm">
          <textarea
            name="message"
            rows={4}
            required
            value={formData.message}
            onChange={handleChange}
            className="resize-none w-full bg-transparent px-4 py-3 text-[13px] sm:text-[14px] text-slate-900 focus:outline-none dark:text-slate-100 font-medium placeholder:text-slate-400"
            placeholder={t("messagePlaceholder")}
          />
          <div className="flex items-center px-3 pb-2.5 gap-2 border-t border-transparent focus-within:border-slate-100 dark:focus-within:border-slate-800 transition-colors pt-2 mx-1">
            <label className="cursor-pointer text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800" title="Attach JD or Document">
              <Paperclip className="w-4 h-4" />
              <span className="text-[11px] font-semibold">{t("attachFile") || "Attach File"}</span>
              <input 
                type="file" 
                className="hidden" 
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </label>
            {file && (
              <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 px-2.5 py-1 rounded-md truncate max-w-[200px] border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                {file.name}
              </span>
            )}
          </div>
        </div>
      </label>
      <button
        type="submit"
        disabled={status === "submitting" || status === "success"}
        className="mt-4 w-full sm:w-auto self-end group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 dark:from-white dark:to-slate-200 px-6 py-2.5 text-[13px] sm:text-[14px] font-bold text-white dark:text-slate-900 transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-slate-900/20 dark:hover:shadow-white/20 active:scale-95 disabled:opacity-70 disabled:pointer-events-none disabled:transform-none"
      >
        {status === "submitting" ? (
          <>
            <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin opacity-70" />
            {t("submitting")}
          </>
        ) : status === "success" ? (
          <>
            <Check className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
            {t("success")}
          </>
        ) : status === "error" ? (
          t("error")
        ) : (
          <>
            {t("submit")}
            <Send className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 opacity-90" />
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
      <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 ml-1">{label}</span>
      <input
        type={type}
        name={name}
        required
        value={value}
        onChange={onChange}
        className="rounded-xl border border-slate-200/80 bg-slate-50/50 px-4 py-2.5 text-[13px] sm:text-[14px] text-slate-900 transition-all focus:border-cyan-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-cyan-500/10 dark:border-slate-800/80 dark:bg-slate-900/50 dark:focus:bg-slate-900 dark:focus:border-cyan-500/50 dark:text-slate-100 font-medium placeholder:text-slate-400 shadow-sm"
        placeholder={placeholder}
      />
    </label>
  );
}
