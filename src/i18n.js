import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import your translations
import en from './locales/en.json';
import ur from './locales/ur.json';

const resources = {
  en: { translation: en },
  ur: { translation: ur },
};

// Set default language (can be dynamic later)
const defaultLanguage = 'en'; // fallback language

i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    resources,
    lng: defaultLanguage, // set manually instead of RNLocalize
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });

export default i18n;
