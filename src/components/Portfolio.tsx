"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { PROJECTS } from "@/data/projects";
import { blotch, buildPixelMask } from "@/lib/visual";
import AboutPage from "./AboutPage";
import ContactPage from "./ContactPage";
import ExperiencePage from "./ExperiencePage";
import Header from "./Header";
import Loader from "./Loader";
import ProjectView from "./ProjectView";
import Works from "./Works";

export type Page = "about" | "experience" | "contact";
export type View = "works" | Page;

const PAGES: Page[] = ["about", "experience", "contact"];
const HASH: Record<View, string> = { works: "", about: "sobre", experience: "experiencias", contact: "contato" };

/*
  Estados visuais ficam em classes no elemento raiz (.app), como no site original:
  ready · nav-away · collapsed · stage-hidden · project-open · view-<página> · <página>-collapsed
  Sair de uma vista: ela colapsa num blob de borda pixelada.
  Entrar numa página clara: um véu preto se dissolve em pontos (meio-tom).
*/
export default function Portfolio() {
  const appRef = useRef<HTMLDivElement>(null);
  const veilRef = useRef<HTMLCanvasElement>(null);
  const projectRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<Record<Page, HTMLElement | null>>({ about: null, experience: null, contact: null });

  const [ready, setReady] = useState(false);
  const [view, setView] = useState<View>("works");
  const [projectIdx, setProjectIdx] = useState<number | null>(null);
  const [projectOpen, setProjectOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const viewRef = useRef<View>("works");
  const navBusy = useRef(false);
  const transitioning = useRef(false);

  const has = (c: string) => !!appRef.current?.classList.contains(c);
  const add = (...c: string[]) => appRef.current?.classList.add(...c);
  const rm = (...c: string[]) => appRef.current?.classList.remove(...c);
  const later = (ms: number, fn: () => void) => window.setTimeout(fn, ms);

  const setHash = (v: View) =>
    history.replaceState(null, "", HASH[v] ? `#${HASH[v]}` : location.pathname + location.search);

  /* ---------- véu de meio-tom ---------- */
  const veilBlack = () => {
    const ht = veilRef.current!;
    const DPR = Math.min(2, devicePixelRatio || 1);
    ht.width = innerWidth * DPR;
    ht.height = innerHeight * DPR;
    ht.style.width = innerWidth + "px";
    ht.style.height = innerHeight + "px";
    const g = ht.getContext("2d")!;
    g.fillStyle = "#080808";
    g.fillRect(0, 0, ht.width, ht.height);
  };
  const halftoneReveal = (done: () => void) => {
    const ht = veilRef.current!;
    const g = ht.getContext("2d")!;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      g.clearRect(0, 0, ht.width, ht.height);
      done();
      return;
    }
    const DPR = Math.min(2, devicePixelRatio || 1);
    const CELL = 14 * DPR;
    const cols = Math.ceil(ht.width / CELL), rows = Math.ceil(ht.height / CELL);
    const cells: { c: number; r: number; off: number }[] = [];
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++) {
        const b = blotch((c * CELL) / DPR, (r * CELL) / DPR);
        cells.push({ c, r, off: (b * 0.5 + 0.5) * 0.7 + Math.random() * 0.3 });
      }
    const DUR = 950;
    let t0: number | null = null;
    const frame = (ts: number) => {
      if (t0 === null) t0 = ts;
      const k = Math.min(1, (ts - t0) / DUR);
      g.clearRect(0, 0, ht.width, ht.height);
      g.fillStyle = "#080808";
      for (const cl of cells) {
        const local = (k - cl.off * 0.82) / 0.18;
        if (local >= 1) continue;
        if (local <= 0) g.fillRect(cl.c * CELL - 0.5, cl.r * CELL - 0.5, CELL + 1, CELL + 1);
        else {
          g.beginPath();
          g.arc(cl.c * CELL + CELL / 2, cl.r * CELL + CELL / 2, (CELL * (1 - local)) / 2, 0, 6.2832);
          g.fill();
        }
      }
      if (k < 1) requestAnimationFrame(frame);
      else {
        g.clearRect(0, 0, ht.width, ht.height);
        done();
      }
    };
    requestAnimationFrame(frame);
  };
  const revealPage = (p: Page) => {
    add(`view-${p}`);
    const el = pageRefs.current[p];
    if (el) el.scrollTop = 0;
    veilBlack();
    requestAnimationFrame(() => halftoneReveal(() => (navBusy.current = false)));
  };

  /* ---------- projeto ---------- */
  const openProject = useCallback((i: number) => {
    if (transitioning.current || navBusy.current || has("project-open")) return;
    transitioning.current = true;
    setProjectIdx(i);
    setProjectOpen(true);
    if (projectRef.current) projectRef.current.scrollTop = 0;
    buildPixelMask(appRef.current!);
    rm("nav-away");
    add("collapsed");
    later(780, () => {
      add("project-open", "stage-hidden");
      later(700, () => (transitioning.current = false));
    });
  }, []);

  const closeProject = useCallback(() => {
    if (transitioning.current || !has("project-open")) return;
    transitioning.current = true;
    rm("nav-away", "project-open");
    setProjectOpen(false);
    later(450, () => {
      rm("stage-hidden");
      requestAnimationFrame(() => rm("collapsed")); // o anel reabre do blob
      later(1000, () => {
        transitioning.current = false;
        setProjectIdx(null);
      });
    });
  }, []);

  /* ---------- navegação ---------- */
  const goTo = useCallback((target: View) => {
    if (navBusy.current) return;

    /* de um projeto aberto direto para uma página */
    if (has("project-open")) {
      if (target === "works") return closeProject();
      if (transitioning.current) return;
      navBusy.current = transitioning.current = true;
      rm("nav-away", "project-open");
      setProjectOpen(false);
      viewRef.current = target;
      setView(target);
      setHash(target);
      later(680, () => {
        setProjectIdx(null);
        transitioning.current = false;
        revealPage(target as Page);
      });
      return;
    }

    if (viewRef.current === target) return;
    navBusy.current = true;
    rm("nav-away");
    const from = viewRef.current;
    viewRef.current = target;
    setView(target);
    setHash(target);
    buildPixelMask(appRef.current!);

    /* 1. a vista atual colapsa */
    add(from === "works" ? "collapsed" : `${from}-collapsed`);
    later(860, () => {
      /* 2. some */
      if (from === "works") add("stage-hidden");
      else rm(`view-${from}`, `${from}-collapsed`);
      /* 3. a nova entra */
      if (target === "works") {
        rm("stage-hidden");
        requestAnimationFrame(() => {
          rm("collapsed");
          later(1000, () => (navBusy.current = false));
        });
      } else revealPage(target);
    });
  }, []);

  /* chegou por um link com #sobre, #experiencias ou #contato */
  useLayoutEffect(() => {
    const h = location.hash.slice(1);
    const target = PAGES.find((p) => HASH[p] === h);
    if (!target) return;
    viewRef.current = target;
    setView(target);
    add("collapsed", "stage-hidden", `view-${target}`);
  }, []);

  /* links com # trocados depois de carregado (ex.: /#contato) */
  useEffect(() => {
    const onHash = () => {
      const h = location.hash.slice(1);
      const target = (Object.keys(HASH) as View[]).find((v) => HASH[v] === h) ?? "works";
      setMenuOpen(false);
      goTo(target);
    };
    addEventListener("hashchange", onHash);
    return () => removeEventListener("hashchange", onHash);
  }, [goTo]);

  /* navegação recolhe ao rolar para baixo e volta ao subir */
  useEffect(() => {
    const els = [...PAGES.map((p) => pageRefs.current[p]), projectRef.current].filter(Boolean) as HTMLElement[];
    const offs = els.map((el) => {
      let last = 0;
      const on = () => {
        const y = el.scrollTop;
        if (y > last + 4 && y > 70) add("nav-away");
        else if (y < last - 4 || y <= 70) rm("nav-away");
        last = y;
      };
      el.addEventListener("scroll", on, { passive: true });
      return () => el.removeEventListener("scroll", on);
    });
    return () => offs.forEach((f) => f());
  }, []);

  /* teclado: Esc fecha, setas navegam entre projetos */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (menuOpen) setMenuOpen(false);
        else closeProject();
        return;
      }
      if (!projectOpen || projectIdx === null) return;
      if (e.key === "ArrowRight" && projectIdx < PROJECTS.length - 1) setProjectIdx(projectIdx + 1);
      if (e.key === "ArrowLeft" && projectIdx > 0) setProjectIdx(projectIdx - 1);
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [menuOpen, projectOpen, projectIdx, closeProject]);

  const active: View = projectOpen ? "works" : view;

  return (
    <div className="app" ref={appRef}>
      <Loader
        onDone={() => {
          add("ready");
          setReady(true);
        }}
      />

      <Header
        active={active}
        onNav={(v) => (v === "works" && projectOpen ? closeProject() : goTo(v))}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        onPeek={() => rm("nav-away")}
        onLeave={() => {
          const scroller = has("project-open") ? projectRef.current : view === "works" ? null : pageRefs.current[view];
          if (scroller && scroller.scrollTop > 70) add("nav-away");
        }}
      />

      <Works projects={PROJECTS} running={ready} onOpen={openProject} />

      <ProjectView
        ref={projectRef}
        projects={PROJECTS}
        index={projectIdx}
        open={projectOpen}
        onClose={closeProject}
        onNavigate={(i) => {
          if (i < 0 || i >= PROJECTS.length) return;
          setProjectIdx(i);
          projectRef.current?.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />

      {PAGES.map((p) => (
        <section
          key={p}
          id={p}
          className="page"
          aria-hidden={view !== p}
          ref={(el) => {
            pageRefs.current[p] = el;
          }}
        >
          {p === "about" ? <AboutPage /> : p === "experience" ? <ExperiencePage /> : <ContactPage />}
        </section>
      ))}

      <canvas id="halftone" ref={veilRef} aria-hidden="true" />
    </div>
  );
}
