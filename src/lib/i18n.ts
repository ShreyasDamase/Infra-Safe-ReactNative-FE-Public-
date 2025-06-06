// src/lib/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import mr from './locales/mr.json';
import hi from './locales/hi.json';
import { mmkvStorage } from '@/store/storage';

const LANGUAGE_KEY = 'app-language';

i18n
    .use(initReactI18next)
    .init({
        compatibilityJSON: 'v4',
        lng: mmkvStorage.getItem(LANGUAGE_KEY) || 'en',
        fallbackLng: 'en',
        resources: {
            en: { translation: en },
            mr: { translation: mr },
            hi: { translation: hi },
        },
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
export { LANGUAGE_KEY };
