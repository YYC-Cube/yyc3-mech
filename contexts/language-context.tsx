"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

type Language = "zh" | "en";

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, enText: string) => string;
};

const LanguageContext = createContext<LanguageContextType>({
  language: "zh",
  setLanguage: () => {},
  t: (key) => key,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  // 从本地存储或浏览器设置中获取初始语言
  const [language, setLanguageState] = useState<Language>("zh");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // 从本地存储中获取语言设置
    try {
      const savedLanguage = localStorage.getItem("nexus-language");
      if (savedLanguage === "en" || savedLanguage === "zh") {
        setLanguageState(savedLanguage);
      } else {
        // 如果没有保存的语言设置，则检查浏览器语言
        const browserLang = navigator.language.toLowerCase();
        if (browserLang.startsWith("en")) {
          setLanguageState("en");
        }
      }
    } catch (error) {
      console.error("获取语言设置失败:", error);
    }
  }, []);

  // 设置语言并保存到本地存储
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (isClient) {
      try {
        localStorage.setItem("nexus-language", lang);
      } catch (error) {
        console.error("保存语言设置失败:", error);
      }
    }
  };

  // 简单的翻译函数
  const t = (key: string, enText: string): string => {
    if (language === "en") {
      return enText;
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

// 使用语言的Hook
export function useLanguage() {
  const context = useContext(LanguageContext);
  return context;
}
