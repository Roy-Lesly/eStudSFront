"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import i18nConfig from "@/*";

const flags = {
  en: "/locales/gb.svg",
  fr: "/locales/fr.svg",
};

export default function LanguageSwitcher({ currentLocale }: { currentLocale: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const params = useParams()

  const changeLanguage = (newLocale: string) => {
    localStorage.setItem("locale", newLocale)
    if (newLocale === currentLocale) {}
    else {
      if (window.location.pathname.length > 1){
        const newPath = `/${newLocale}${window.location.pathname.replace(/^\/(en|fr)/, "")}`;
        window.location.href = newPath;
      } else {
        const newPath = `/${newLocale}/${params?.domain}`;
        window.location.href = newPath;
      }
    }
    setIsOpen(false);
  };
  return (
    <div className="border rounded-lg relative inline-block">
      <motion.button
        className="flex items-center gap-2 p-2 rounded-lg bg-gray-200 hover:bg-gray-300"
        onClick={() => setIsOpen(!isOpen)}
        initial={{ rotate: 0 }}
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <Image 
        src={flags[currentLocale as "en" | "fr"] || ""} 
        alt={currentLocale} width={24} height={24} 
        className="rounded-xl" 
        />
        <span className="text-sm font-semibold">{currentLocale?.toUpperCase()}</span>
      </motion.button>

      <motion.div
        className={`absolute mt-2 bg-white rounded-lg shadow-lg w-24 p-2 ${
          isOpen ? "block" : "hidden"
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {i18nConfig.locales.map((locale) => (
          <button
            key={locale}
            onClick={() => changeLanguage(locale)}
            className={`flex items-center gap-2 p-2 rounded-lg w-full text-left hover:bg-gray-200 ${
              currentLocale === locale ? "bg-blue-500 text-white" : "text-gray-700"
            }`}
          >
            <Image src={flags[locale as "en" | "fr"]} alt={locale} width={20} height={20} className="rounded-xl" />
            <span className="text-sm font-semibold">{locale.toUpperCase()}</span>
          </button>
        ))}
      </motion.div>
    </div>
  );
}
