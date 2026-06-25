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
    <form className="flex flex-col gap-6 flex-grow relative z-10" onSubmit={handleSubmit}>
      <div className="grid gap-6 sm:grid-cols-2">
        <ContactInput label={t("fullName")} name="name" value={formData.name} onChange={handleChange} placeholder={t("fullNamePlaceholder")} />
        <ContactInput label={t("email")} name="email" type="email" value={formData.email} onChange={handleChange} placeholder={t("emailPlaceholder")} />
      </div>
      <ContactInput label={t("subject")} name="subject" value={formData.subject} onChange={handleChange} placeholder={t("subjectPlaceholder")} />
      <label className="flex flex-col gap-2.5">
        <span className="text-[15px] font-bold text-neutral-800 dark:text-neutral-200">{t("message")}</span>
        <div className="relative flex flex-col rounded-xl border border-neutral-200/80 bg-white/50 focus-within:border-cyan-500 focus-within:ring-4 focus-within:ring-cyan-500/10 dark:border-neutral-800 dark:bg-neutral-950/50 transition-all duration-300">
          <textarea
            name="message"
            rows={5}
            required
            value={formData.message}
            onChange={handleChange}
            className="resize-none w-full bg-transparent px-4 py-4 text-[15px] text-neutral-900 focus:outline-none dark:text-neutral-100 font-medium placeholder:text-neutral-400"
            placeholder={t("messagePlaceholder")}
          />
          <div className="flex items-center px-4 pb-3 gap-3">
            <label className="cursor-pointer text-neutral-400 hover:text-cyan-600 transition-colors flex items-center gap-1" title="Attach JD or Document">
              <Paperclip className="w-5 h-5" />
              <input 
                type="file" 
                className="hidden" 
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </label>
            {file && (
              <span className="text-xs text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2.5 py-1 rounded-md truncate max-w-[200px] border border-neutral-200 dark:border-neutral-700">
                {file.name}
              </span>
            )}
          </div>
        </div>
      </label>
      <button
        type="submit"
        disabled={status === "submitting" || status === "success"}
        className="mt-4 w-full sm:w-auto self-end group inline-flex items-center justify-center gap-2.5 rounded-xl bg-[#0f172a] px-8 py-3.5 text-[15px] font-bold text-white transition-all duration-300 hover:bg-cyan-600 hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-500/25 active:scale-95 disabled:opacity-70 disabled:pointer-events-none"
      >
        {status === "submitting" ? (
          <>
            <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            {t("submitting")}
          </>
        ) : status === "success" ? (
          <>
            <Check className="h-4 w-4" />
            {t("success")}
          </>
        ) : status === "error" ? (
          t("error")
        ) : (
          <>
            {t("submit")}
            <Send className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
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
    <label className="flex flex-col gap-2.5">
      <span className="text-[15px] font-bold text-neutral-800 dark:text-neutral-200">{label}</span>
      <input
        type={type}
        name={name}
        required
        value={value}
        onChange={onChange}
        className="rounded-xl border border-neutral-200/80 bg-white/50 px-4 py-3.5 text-[15px] text-neutral-900 transition-all duration-300 focus:border-cyan-500 focus:outline-none focus:ring-4 focus:ring-cyan-500/10 dark:border-neutral-800 dark:bg-neutral-950/50 dark:text-neutral-100 font-medium placeholder:text-neutral-400"
        placeholder={placeholder}
      />
    </label>
  );
}
