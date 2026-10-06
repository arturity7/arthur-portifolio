"use client";

import { EXPERIENCES } from "@/data/experiences";
import { useLang } from "@/i18n/LanguageProvider";
import PageFoot from "./PageFoot";

export default function ExperiencePage() {
  const { t, tr, lang } = useLang();
  const x = t.experience;

  /* "2025-03" → "mar. 2025" / "Mar 2025" */
  const month = (ym: string) => {
    if (!ym) return "…";
    const [y, m] = ym.split("-").map(Number);
    if (!m) return String(y);
    return new Intl.DateTimeFormat(lang === "pt" ? "pt-BR" : "en-US", {
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    }).format(new Date(Date.UTC(y, m - 1, 1)));
  };

  return (
    <div className="pg-inner xp">
      <div className="pg-bar">
        <span>{x.section}</span>
        <span>{x.count(EXPERIENCES.length)}</span>
      </div>

      <h1 className="pg-title">{x.section}</h1>

      <div className="xp-cols" aria-hidden="true">
        <span>{x.cols.when}</span>
        <span>{x.cols.where}</span>
        <span>{x.cols.what}</span>
      </div>

      <ol className="xp-list">
        {EXPERIENCES.map((e) => (
          <li key={e.org + e.start} className="xp-item">
            <div className="xp-when">
              <span>
                {month(e.start)} — {e.end ? month(e.end) : x.now}
              </span>
              {!e.end && <span className="xp-live" aria-hidden="true" />}
            </div>
            <div className="xp-where">
              <h2>{e.link ? <a href={e.link} target="_blank" rel="noopener noreferrer">{e.org}</a> : e.org}</h2>
              <span className="xp-kind">{x.kinds[e.kind]}</span>
            </div>
            <div className="xp-what">
              <p className="xp-role">{tr(e.role)}</p>
              <p>{tr(e.description)}</p>
            </div>
          </li>
        ))}
      </ol>

      <PageFoot />
    </div>
  );
}
