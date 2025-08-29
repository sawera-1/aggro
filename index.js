/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import en from './src/locales/en.json';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';


const resources = {
    en:{translation:en}
}
const loadSelectedLanguage = async () => {
  try {

    return {label: 'English', value: 'en'}
    // const languageString = await AsyncStorage.getItem('selectedLanguage');
    // return languageString
    //   ? JSON.parse(languageString)
    //   : {label: 'English', value: 'en'}; // Default to English if no language is stored
  } catch (error) {
    console.error('Error loading language:', error);
    return {label: 'English', value: 'en'}; // Default to English in case of error
  }
};

const initializeLanguage = async () => {
  const selectedLanguage = await loadSelectedLanguage();
  i18next.use(initReactI18next).init({
    resources,
    compatibilityJSON: 'v3',
    lng: selectedLanguage.value,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });
};

initializeLanguage();



AppRegistry.registerComponent(appName, () => App);


