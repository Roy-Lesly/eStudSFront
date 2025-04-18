"use client";

import { ReactNode, useEffect, useState } from "react";
import { I18nextProvider } from "react-i18next";
import i18next from "i18next";
import { initReactI18next } from "react-i18next";

interface I18nProviderProps {
  locale: string;
  translations: Record<string, any>;
  children: ReactNode;
}

export default function I18nProvider({ locale, translations, children }: I18nProviderProps) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!i18next.isInitialized) {
      i18next
        .use(initReactI18next)
        .init({
          lng: locale,
          fallbackLng: "en",
          interpolation: { escapeValue: false }, // Recommended for React
          ns: Object.keys(translations), // Extract namespaces from translations object
          defaultNS: "common",
          resources: { [locale]: translations },
        })
        .then(() => setIsReady(true)); // Set state when ready
    } else {
      i18next.changeLanguage(locale);
      setIsReady(true);
    }
  }, [locale, translations]);

  if (!isReady) return null; // Prevent rendering until initialized

  return <I18nextProvider i18n={i18next}>{children}</I18nextProvider>;
}
