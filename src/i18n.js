import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { I18nManager } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import en from "./locales/en.json";
import ur from "./locales/ur.json";

const initI18n = async () => {
  const savedLang = await AsyncStorage.getItem("selectedLanguage");
  const defaultLang = savedLang || "en";

  await i18n
    .use(initReactI18next)
    .init({
      compatibilityJSON: "v3",
      resources: {
        en: { translation: en },
        ur: { translation: ur },
      },
      lng: defaultLang,
      fallbackLng: "en",
      interpolation: {
        escapeValue: false,
      },
    });

  // ✅ Keep layout always LTR (no flipping for Urdu)
  // But Urdu text will still appear RTL naturally.
  if (I18nManager.isRTL) {
    I18nManager.allowRTL(false);
    I18nManager.forceRTL(false);
  }
};

initI18n();

export default i18n;
