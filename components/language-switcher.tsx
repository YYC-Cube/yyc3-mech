"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Globe } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { useSound } from "@/contexts/sound-context";

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();
  const { playSound } = useSound();
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    playSound("click");
  };

  const handleLanguageChange = (lang: "zh" | "en") => {
    setLanguage(lang);
    setIsOpen(false);
    playSound("click");
  };

  return (
    <div className="relative">
      <button
        onClick={handleToggle}
        className="w-10 h-10 flex items-center justify-center rounded-md border border-[#25272E] bg-[#25272E]/50 hover:bg-[#25272E] transition-colors shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
        title={t("切换语言", "Switch Language")}
      >
        <Globe size={16} className="text-[#D0D5DE]" />
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute top-full mt-2 right-0 bg-[#1F2127] border border-[#25272E] rounded-md p-2 shadow-lg z-10 w-32"
        >
          <div className="space-y-1">
            <button
              className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                language === "zh"
                  ? "bg-[#FF6B3C]/20 text-[#FF6B3C]"
                  : "hover:bg-[#25272E]"
              }`}
              onClick={() => handleLanguageChange("zh")}
            >
              中文
            </button>
            <button
              className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                language === "en"
                  ? "bg-[#FF6B3C]/20 text-[#FF6B3C]"
                  : "hover:bg-[#25272E]"
              }`}
              onClick={() => handleLanguageChange("en")}
            >
              English
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
