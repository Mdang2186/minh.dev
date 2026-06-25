"use client";

import { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "vi" | "ja" | "fr" | "es" | "zh" | "ko";

interface AdminLanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const AdminLanguageContext = createContext<AdminLanguageContextType | undefined>(undefined);

export function AdminLanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  // Load language from localStorage if available
  useEffect(() => {
    const saved = localStorage.getItem("adminEditingLanguage") as Language | null;
    const validLanguages = ["en", "vi", "ja", "fr", "es", "zh", "ko"];
    if (saved && validLanguages.includes(saved)) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("adminEditingLanguage", lang);
  };

  return (
    <AdminLanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </AdminLanguageContext.Provider>
  );
}

export function useAdminLanguage() {
  const context = useContext(AdminLanguageContext);
  if (!context) {
    throw new Error("useAdminLanguage must be used within an AdminLanguageProvider");
  }
  return context;
}
