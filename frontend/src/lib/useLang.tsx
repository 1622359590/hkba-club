'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { Lang } from './api';

interface LangContextType { lang: Lang; setLang: (l: Lang) => void; t: (zh: string, en: string) => string; }
const LangContext = createContext<LangContextType>({ lang: 'zh', setLang: () => {}, t: (zh) => zh });

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('zh');
  useEffect(() => {
    const saved = localStorage.getItem('hkba_lang');
    if (saved === 'zh' || saved === 'en') setLang(saved);
  }, []);
  useEffect(() => {
    localStorage.setItem('hkba_lang', lang);
  }, [lang]);
  const t = (zh: string, en: string) => lang === 'zh' ? zh : en;
  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>;
}

export function useLang() { return useContext(LangContext); }
