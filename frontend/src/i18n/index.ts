import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Import tutti i file di traduzione
import it from './locales/it/translation.json'
import en from './locales/en/translation.json'
import es from './locales/es/translation.json'
import fr from './locales/fr/translation.json'
import de from './locales/de/translation.json'
import pt from './locales/pt/translation.json'
import pl from './locales/pl/translation.json'
import zh from './locales/zh/translation.json'
import ja from './locales/ja/translation.json'
import ko from './locales/ko/translation.json'
import ar from './locales/ar/translation.json'

export const SUPPORTED_LANGUAGES = [
  { code: 'it', label: '🇮🇹 Italiano',  dir: 'ltr' },
  { code: 'en', label: '🇬🇧 English',   dir: 'ltr' },
  { code: 'es', label: '🇪🇸 Español',   dir: 'ltr' },
  { code: 'fr', label: '🇫🇷 Français',  dir: 'ltr' },
  { code: 'de', label: '🇩🇪 Deutsch',   dir: 'ltr' },
  { code: 'pt', label: '🇵🇹 Português', dir: 'ltr' },
  { code: 'pl', label: '🇵🇱 Polski',    dir: 'ltr' },
  { code: 'zh', label: '🇨🇳 中文',      dir: 'ltr' },
  { code: 'ja', label: '🇯🇵 日本語',    dir: 'ltr' },
  { code: 'ko', label: '🇰🇷 한국어',    dir: 'ltr' },
  { code: 'ar', label: '🇸🇦 العربية',  dir: 'rtl' },
] as const

export type LangCode = typeof SUPPORTED_LANGUAGES[number]['code']

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: { it, en, es, fr, de, pt, pl, zh, ja, ko, ar },
    defaultNS: 'translation',
    fallbackLng: 'it',
    supportedLngs: SUPPORTED_LANGUAGES.map(l => l.code),
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'av_lang',
    },
    interpolation: {
      escapeValue: false, // React fa già escaping
    },
  })

// Imposta la direzione del testo per RTL (es. Arabo)
export function applyDirection(lang: string) {
  const l = SUPPORTED_LANGUAGES.find(x => x.code === lang)
  document.documentElement.dir  = l?.dir ?? 'ltr'
  document.documentElement.lang = lang
}

// Applica direzione al cambio lingua
i18n.on('languageChanged', applyDirection)

export default i18n
