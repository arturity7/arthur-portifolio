"use client";

import { useLang } from "@/i18n/LanguageProvider";
import PageFoot from "./PageFoot";

export default function AboutPage() {
  const { t } = useLang();
  const a = t.about;

  return (
    <div className="pg-inner about">
      <div className="pg-bar">
        <span>{a.section}</span>
        <span>{a.coords}</span>
      </div>

      <h1 className="ab-name">
        <span>Arthur</span>
        <span className="ab-name-2">Gabriel</span>
      </h1>

      <div className="ab-grid">
        <figure className="ab-photo">
          <img src="/img/arthur.jpg" alt="Arthur Gabriel" width={760} height={1351} />
          <figcaption>{a.caption}</figcaption>
        </figure>

        <div className="ab-text">
          <p className="ab-lead">{a.lead}</p>
          {a.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}

          <dl className="ab-facts">
            {a.facts.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <PageFoot />
    </div>
  );
}
