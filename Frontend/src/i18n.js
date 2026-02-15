import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
  .use(Backend) // Load translations via HTTP
  .use(LanguageDetector) // Detect user language
  .use(initReactI18next) // Pass to React
  .init({
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development', // Enable in dev mode
    
    interpolation: {
      escapeValue: false, // React already safes from XSS
    },
    
    backend: {
      loadPath: '/locales/{{lng}}/translation.json',
    },
    
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'], // Save language preference
    },
  });

export default i18n;