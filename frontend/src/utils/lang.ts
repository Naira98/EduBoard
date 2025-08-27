import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import ar from "../assets/locales/ar/translation.json";
import en from "../assets/locales/en/translation.json";

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    detection: {
      order: ["localStorage", "htmlTag"],
      caches: ["localStorage"],
    },
    resources: {
      ar: { translation: ar },
      en: { translation: en },
    },
  });
