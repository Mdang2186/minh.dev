"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Language = "en" | "vi" | "ja" | "fr" | "es" | "zh" | "ko";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const saved = localStorage.getItem("language") as Language;
    const validLanguages = ["en", "vi", "ja", "fr", "es", "zh", "ko"];
    
    if (saved && validLanguages.includes(saved)) {
      setLanguageState(saved);
    } else {
      // Auto detect locale if preferred
      const navLang = navigator.language.slice(0, 2);
      if (validLanguages.includes(navLang)) {
        setLanguageState(navLang as Language);
      }
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
