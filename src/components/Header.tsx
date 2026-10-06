"use client";

import { useLang } from "@/i18n/LanguageProvider";
import type { View } from "./Portfolio";

type Props = {
  active: View;
  onNav: (v: View) => void;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  onPeek: () => void;
  onLeave: () => void;
};

const ORDER: View[] = ["about", "works", "experience", "contact"];

export default function Header({ active, onNav, menuOpen, setMenuOpen, onPeek, onLeave }: Props) {
  const { t, lang, setLang } = useLang();
  const label: Record<View, string> = {
    works: t.nav.works,
    about: t.nav.about,
    experience: t.nav.experience,
    contact: t.nav.contact,
  };

  const link = (v: View, extra = "") => (
    <a
      key={v}
      href={`#${v}`}
      className={`${extra}${active === v ? " on" : ""}`}
      aria-current={active === v ? "page" : undefined}
      onClick={(e) => {
        e.preventDefault();
        setMenuOpen(false);
        onNav(v);
      }}
    >
      {label[v]}
    </a>
  );

  const langSwitch = (
    <div className="lang" role="group" aria-label={t.nav.langLabel}>
      {(["pt", "en"] as const).map((l) => (
        <button key={l} type="button" aria-pressed={lang === l} className={lang === l ? "on" : ""} onClick={() => setLang(l)}>
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );

  return (
    <>
      <div id="nav-peek" onMouseEnter={onPeek} onClick={onPeek} />
      <header className="site-head" onMouseLeave={onLeave}>
        <nav>
          {langSwitch}
          {link("works", "works")}
          <span className="right">
            {link("about")}
            {link("experience")}
            {link("contact")}
          </span>
          <button type="button" className="menu-btn" aria-expanded={menuOpen} onClick={() => setMenuOpen(true)}>
            {t.nav.menu}
          </button>
        </nav>
      </header>

      {/* menu do celular */}
      <div className={`mnav${menuOpen ? " open" : ""}`} aria-hidden={!menuOpen}>
        <div className="mnav-top">
          {langSwitch}
          <button type="button" className="menu-btn" onClick={() => setMenuOpen(false)}>
            {t.nav.close}
          </button>
        </div>
        <ol>
          {ORDER.map((v, i) => (
            <li key={v}>
              <span className="mnav-n">{String(i + 1).padStart(2, "0")}</span>
              {link(v)}
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}
