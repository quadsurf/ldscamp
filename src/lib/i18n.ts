import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  // Load translation files from the public folder (e.g., public/locales/en/common.json)
  .use(HttpBackend)
  // Detect user language automatically
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize i18next
  .init({
    fallbackLng: 'en',
    supportedLngs: ['en', 'es'],
    
    // Namespace configuration (matches your CLI extraction setup)
    ns: ['common'],
    defaultNS: 'common',

    // React specific options
    react: {
      useSuspense: false, // Set to true if you are using React Suspense for loading states
    },

    backend: {
      // Path where the CLI will output the JSON files
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },

    // Optional: Log warnings in development mode to help with debugging
    debug: process.env.NODE_ENV === 'development',
    
    interpolation: {
      escapeValue: false, // React already inherently protects against XSS
    },
  });

export default i18n;