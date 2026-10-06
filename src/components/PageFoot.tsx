"use client";

import { useLang } from "@/i18n/LanguageProvider";

export default function PageFoot() {
  const { t } = useLang();
  return (
    <footer className="pg-foot">
      <span>
        © {new Date().getFullYear()} {t.foot.rights}
      </span>
      <span className="pg-foot-mid">Belo Horizonte, MG</span>
      <button
        type="button"
        onClick={(e) => e.currentTarget.closest(".page")?.scrollTo({ top: 0, behavior: "smooth" })}
      >
        {t.foot.top} <span aria-hidden="true">↑</span>
      </button>
    </footer>
  );
}
