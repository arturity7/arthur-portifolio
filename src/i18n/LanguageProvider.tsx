"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { dictionary, type Dict, type Lang, type Localized } from "./dictionary";

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Dict;
  /* traduz um campo { pt, en } vindo dos dados */
  tr: (v: Localized) => string;
};

const LanguageContext = createContext<Ctx | null>(null);
const KEY = "lang";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("pt");

  /* idioma salvo, ou o do navegador na primeira visita */
  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(KEY);
    } catch {}
    const initial: Lang =
      saved === "pt" || saved === "en" ? saved : navigator.language.toLowerCase().startsWith("pt") ? "pt" : "en";
    setLangState(initial);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";
    document.title = dictionary[lang].meta.title;
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(KEY, l);
    } catch {}
  }, []);

  const tr = useCallback((v: Localized) => v[lang], [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: dictionary[lang], tr }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang precisa estar dentro de <LanguageProvider>");
  return ctx;
}
