"use client";

import { useState } from "react";
import { Check, Send } from "lucide-react";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");

    try {
      const response = await fetch("/api/contact", {
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
      const data = await response.json();
      if (data.success) {
        setStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
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
        <ContactInput label="Full Name" name="name" value={formData.name} onChange={handleChange} placeholder="Your Name" />
        <ContactInput label="Email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="email@example.com" />
      </div>
      <ContactInput label="Subject" name="subject" value={formData.subject} onChange={handleChange} placeholder="Example: Project Collaboration Inquiry" />
      <label className="flex flex-col gap-2.5">
        <span className="text-[15px] font-bold text-neutral-800 dark:text-neutral-200">Message</span>
        <textarea
          name="message"
          rows={5}
          required
          value={formData.message}
          onChange={handleChange}
          className="resize-none rounded-xl border border-neutral-200/80 bg-white/50 px-4 py-4 text-[15px] text-neutral-900 transition-all duration-300 focus:border-cyan-500 focus:outline-none focus:ring-4 focus:ring-cyan-500/10 dark:border-neutral-800 dark:bg-neutral-950/50 dark:text-neutral-100 font-medium placeholder:text-neutral-400"
          placeholder="What would you like to discuss?"
        />
      </label>
      <button
        type="submit"
        disabled={status === "submitting" || status === "success"}
        className="mt-4 w-full sm:w-auto self-end group inline-flex items-center justify-center gap-2.5 rounded-xl bg-[#0f172a] px-8 py-3.5 text-[15px] font-bold text-white transition-all duration-300 hover:bg-cyan-600 hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-500/25 active:scale-95 disabled:opacity-70 disabled:pointer-events-none"
      >
        {status === "submitting" ? (
          <>
            <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            Đang gửi...
          </>
        ) : status === "success" ? (
          <>
            <Check className="h-4 w-4" />
            Gửi thành công!
          </>
        ) : status === "error" ? (
          "Gửi thất bại, thử lại!"
        ) : (
          <>
            Gửi tin nhắn
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
