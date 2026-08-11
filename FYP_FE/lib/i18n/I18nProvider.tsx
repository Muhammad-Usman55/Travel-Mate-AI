'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Language } from './translations';

interface I18nContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}

export function I18nProvider({ children, translations }: { children: ReactNode; translations: Record<Language, Record<string, string>> }) {
  const [lang, setLang] = useState<Language>('en');

  const t = useCallback((key: string): string => {
    return translations[lang]?.[key] || translations['en']?.[key] || key;
  }, [lang, translations]);

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}
