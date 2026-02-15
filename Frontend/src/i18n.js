import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en/translation.json';
import hi from './locales/hi/translation.json';
import mr from './locales/mr/translation.json';

i18n
  .use(LanguageDetector) // Detect user language
  .use(initReactI18next) // Pass to React
  .init({
    resources: {
      en: { translation: en },
      hi: { translation: hi },
      mr: { translation: mr },
    },
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development', // Enable in dev mode

    interpolation: {
      escapeValue: false, // React already safe from XSS
    },

    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'], // Save language preference
    },
  });

export default i18n;