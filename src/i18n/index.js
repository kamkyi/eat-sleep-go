import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { defaultLanguage, dictionaries, languages } from './translations';

const STORAGE_KEY = 'esg-language';
const LanguageContext = createContext(null);

const readStored = () => {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return dictionaries[stored] ? stored : defaultLanguage;
  } catch {
    return defaultLanguage;
  }
};

const lookup = (dictionary, path) => path.split('.').reduce((value, key) => (value == null ? undefined : value[key]), dictionary);

const fill = (template, values) => template.replace(/\{(\w+)\}/g, (match, key) => (values[key] == null ? match : values[key]));

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(readStored);

  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* storage unavailable — language still applies for this session */
    }
  }, [lang]);

  const t = useCallback((path, values) => {
    const text = lookup(dictionaries[lang], path) ?? lookup(dictionaries[defaultLanguage], path);
    if (typeof text !== 'string') return path;
    return values ? fill(text, values) : text;
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang, t, languages }), [lang, t]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useI18n() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useI18n must be used inside a LanguageProvider');
  return context;
}
