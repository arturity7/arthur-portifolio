"use client";

import { forwardRef } from "react";
import { FaGithub, FaLock } from "react-icons/fa6";
import type { Project } from "@/data/projects";
import { useLang } from "@/i18n/LanguageProvider";
import { pad3 } from "@/lib/visual";

type Props = {
  projects: Project[];
  index: number | null;
  open: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
};

/* Projeto aberto: GIF em destaque, descrição embaixo e a linha do tempo de todos os projetos. */
const ProjectView = forwardRef<HTMLDivElement, Props>(function ProjectView(
  { projects, index, open, onClose, onNavigate },
  ref,
) {
  const { t, tr } = useLang();
  const p = index !== null ? projects[index] : null;
  const total = projects.length;

  return (
    <div id="project" ref={ref} aria-hidden={!open} role="dialog" aria-label={p?.title}>
      {p && index !== null && (
        <>
          <div className="pv-top">
            <button type="button" className="pv-back" onClick={onClose}>
              <span aria-hidden="true">←</span> {t.project.back}
            </button>
            <span className="pv-count">
              {pad3(index + 1)} <i>{t.project.of}</i> {pad3(total)}
            </span>
          </div>

          <article className="pv" key={p.slug}>
            <figure className="pv-media">
              {p.media ? (
                <video
                  key={p.slug}
                  src={p.media.video}
                  poster={p.media.poster}
                  autoPlay={open}
                  muted
                  loop
                  playsInline
                  preload={open ? "auto" : "none"}
                  aria-label={`${p.title} — ${t.project.demo}`}
                />
              ) : (
                <div className="pv-nogif">
                  <span>{t.project.noGif}</span>
                </div>
              )}
            </figure>

            <div className="pv-body">
              <header className="pv-head">
                <span className="pv-year">{p.date.slice(0, 4)}</span>
                <h2 className="pv-title">{p.title}</h2>
              </header>
              <p className="pv-desc">{tr(p.description)}</p>
              <div className="pv-side">
                <span className="pv-label">{t.project.stack}</span>
                <ul className="pv-stack">
                  {p.stack.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
                {p.repo ? (
                  <a className="pv-repo" href={p.repo} target="_blank" rel="noopener noreferrer">
                    <FaGithub aria-hidden="true" />
                    <span>{t.project.repo}</span>
                    <span aria-hidden="true">↗</span>
                  </a>
                ) : (
                  <span className="pv-repo pv-private">
                    <FaLock aria-hidden="true" />
                    <span>{t.project.repoPrivate}</span>
                  </span>
                )}
              </div>
            </div>
          </article>

          <nav className="pv-timeline" aria-label={t.project.timeline}>
            <span className="pv-label">{t.project.timeline}</span>
            <div className="pv-tl-row">
              <button
                type="button"
                className="pv-step"
                onClick={() => onNavigate(index - 1)}
                disabled={index === 0}
                aria-label={t.project.prev}
              >
                ←
              </button>
              <ol className="pv-tl">
                {projects.map((q, j) => (
                  <li key={q.slug}>
                    <button
                      type="button"
                      className={j === index ? "on" : ""}
                      aria-current={j === index ? "step" : undefined}
                      onClick={() => onNavigate(j)}
                    >
                      <span className="y">{q.date.slice(0, 4)}</span>
                      <span className="dot" aria-hidden="true" />
                      <span className="n">{q.title}</span>
                    </button>
                  </li>
                ))}
              </ol>
              <button
                type="button"
                className="pv-step"
                onClick={() => onNavigate(index + 1)}
                disabled={index === total - 1}
                aria-label={t.project.next}
              >
                →
              </button>
            </div>
          </nav>
        </>
      )}
    </div>
  );
});

export default ProjectView;
