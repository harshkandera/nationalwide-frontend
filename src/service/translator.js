import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { apiConnector } from './apiconnector';

// Custom backend class for dynamic translation loading
class CustomBackend {
  constructor(services, options = {}) {
    this.init(services, options);
  }

  init(services, options = {}) {
    this.services = services;
    this.options = options;
  }

  async read(language, namespace, callback) {
    try {
      // Call customTranslate to fetch translations
      const translation = await customTranslate(namespace, language);
      callback(null, translation);
    } catch (error) {
      callback(error, false); // Pass error to i18next if translation fails
    }
  }
}

// Custom translation function
const customTranslate = async (key, toLanguage) => {
  try {
    const response = await apiConnector('POST', `${process.env.REACT_APP_BASE_URL}/translate`, {
      text: key,
      toLanguage,
    });
    return response.data.translatedText;
  } catch (error) {
    console.error('Translation failed:', error);
    return key; 
  }
};

// Initialize i18n with the custom backend
i18n
  .use(initReactI18next)
  .use({
    type: 'backend',
    init: () => {},
    create: CustomBackend,
  })
  .init({
    lng: 'en', // Default language
    fallbackLng: 'en',
    debug: true,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
