import i18n from 'i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import { HMRPlugin } from 'i18next-hmr/plugin';

const instance = i18n
  // load translation using http -> see /public/locales
  // learn more: https://github.com/i18next/i18next-http-backend
  .use(Backend)
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next);

if (process.env.NODE_ENV !== 'production') {
  instance.use(new HMRPlugin({ vite: { client: true } }));
}

instance.init({
  fallbackLng: 'en',

  interpolation: {
    escapeValue: false, // not needed for react as it escapes by default
  },
});

export default i18n;