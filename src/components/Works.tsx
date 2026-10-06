"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Mark from "./Mark";
import type { Project } from "@/data/projects";
import { useLang } from "@/i18n/LanguageProvider";
import { pad3, paintThumb } from "@/lib/visual";

/* quantidade mínima de quadros no anel; o que faltar vira "em breve" */
const MIN_TILES = 9;
const ASPECTS = [16 / 9, 16 / 10, 3 / 2, 21 / 10, 16 / 9, 16 / 10, 3 / 2, 16 / 9, 21 / 10, 16 / 10, 3 / 2];
const GOLDEN = Math.PI * (3 - Math.sqrt(5));

type Slot = { project: Project | null; index: number };

/* espalha os projetos reais pelo anel, intercalados com os vazios */
function buildSlots(projects: Project[]): Slot[] {
  const n = Math.max(MIN_TILES, projects.length);
  const slots: Slot[] = Array.from({ length: n }, () => ({ project: null, index: -1 }));
  projects.forEach((p, i) => {
    let at = Math.round((i * n) / projects.length) % n;
    while (slots[at].project) at = (at + 1) % n;
    slots[at] = { project: p, index: i };
  });
  return slots;
}

type Props = {
  projects: Project[];
  running: boolean;
  onOpen: (index: number) => void;
};

export default function Works({ projects, running, onOpen }: Props) {
  const { t } = useLang();
  const slots = useMemo(() => buildSlots(projects), [projects]);
  const geo = useMemo(
    () =>
      slots.map((_, i) => ({
        a0: i * ((Math.PI * 2) / slots.length) + (i % 3) * 0.09,
        rf: 0.82 + ((i * GOLDEN) % 1) * 0.38,
        sf: 0.78 + ((i * 0.618 + 0.21) % 1) * 0.55,
        drift: (i % 2 ? 1 : -1) * (0.06 + ((i * 0.37) % 1) * 0.05),
        ph: i * 1.7,
      })),
    [slots],
  );

  const [paints, setPaints] = useState<string[]>([]);
  const [hot, setHot] = useState<number | null>(null);
  const [coarse, setCoarse] = useState(false);
  const hotRef = useRef<number | null>(null);
  hotRef.current = hot;
  const tileRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const imgRefs = useRef<(HTMLImageElement | null)[]>([]);

  useEffect(() => {
    setCoarse(matchMedia("(pointer: coarse)").matches);
    /* vazios e projetos ainda sem imagem recebem uma pintura procedural */
    setPaints(
      slots.map((s, i) =>
        s.project && (s.project.thumb || s.project.gif)
          ? ""
          : paintThumb(i + 7, 320, Math.round(320 / ASPECTS[i % ASPECTS.length])),
      ),
    );
  }, [slots]);

  /* animação do anel */
  useEffect(() => {
    if (!running) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const state = slots.map((s, i) => ({
      ar: ASPECTS[i % ASPECTS.length],
      born: -1,
      hoverK: 0,
      real: !!s.project,
    }));

    /* prints reais: o quadro adota a proporção exata da imagem */
    slots.forEach((s, i) => {
      const im = imgRefs.current[i];
      if (!s.project || !im) return;
      const fit = () => {
        if (im.naturalWidth) state[i].ar = im.naturalWidth / im.naturalHeight;
      };
      if (im.complete) fit();
      else im.addEventListener("load", fit, { once: true });
    });

    const timers: ReturnType<typeof setTimeout>[] = [];
    [...state.keys()]
      .sort(() => Math.random() - 0.5)
      .forEach((i, k) =>
        timers.push(setTimeout(() => (state[i].born = performance.now()), k * 70 + Math.random() * 60)),
      );

    let base = -0.4;
    let last: number | null = null;
    let raf = 0;
    const ease = (k: number) => 1 - Math.pow(1 - k, 3);

    const frame = (time: number) => {
      if (last === null) last = time;
      const dt = Math.min(50, time - last);
      last = time;
      const hovering = hotRef.current !== null;
      /* o anel continua girando no hover, só mais devagar */
      if (!reduced) base += dt * ((Math.PI * 2) / 80000) * (hovering ? 0.35 : 1);

      const W = innerWidth, H = innerHeight;
      const narrow = W < 680, portrait = H > W;
      /* raio um pouco maior e quadros um pouco menores: respiro entre os projetos */
      const tablet = !narrow && portrait; // tablet em pé: anel mais alto que largo
      const RX = narrow ? W * 0.31 : tablet ? W * 0.27 : Math.min(W * 0.22, 320);
      const RY = narrow ? (portrait ? H * 0.25 : H * 0.27) : tablet ? Math.min(H * 0.24, 260) : Math.min(H * 0.29, 200);
      const BASE = narrow ? W * 0.44 : tablet ? W * 0.3 : Math.min(W, H) * 0.29;

      state.forEach((st, i) => {
        const el = tileRefs.current[i];
        if (!el) return;
        const g = geo[i];
        const target = hotRef.current === i ? 1 : 0;
        st.hoverK += (target - st.hoverK) * Math.min(1, (dt / 280) * 3.4);

        const a = base + g.a0;
        const breathe = reduced ? 0 : Math.sin(time * 0.00035 + g.ph) * 0.03;
        const r = g.rf + breathe * g.drift * 8;
        const x = W / 2 + Math.cos(a) * RX * r;
        const y = H / 2 + Math.sin(a) * RY * r;
        /* normalização por área; projetos reais ganham um leve destaque */
        const boost = st.real ? (narrow ? 1.08 : 1.14) : 1;
        let w = BASE * 0.85 * g.sf * Math.sqrt(st.ar / 1.6) * boost;
        w = Math.min(w, narrow ? W * 0.6 : BASE * 1.5);
        const h = w / st.ar;
        let xx = x, yy = y;
        if (narrow) {
          xx = Math.max(w / 2 + 5, Math.min(W - w / 2 - 5, x));
          yy = Math.max(h / 2 + 64, Math.min(H - h / 2 - 56, y));
        }

        let s = 0, o = 0;
        if (st.born >= 0) {
          const e = ease(Math.min(1, (time - st.born) / 750));
          s = 0.25 + 0.75 * e;
          o = e;
        }
        s *= 1 + 0.22 * st.hoverK;

        el.style.opacity = String(o);
        el.style.width = w + "px";
        el.style.height = h + "px";
        el.style.transform = `translate(${xx - w / 2}px,${yy - h / 2}px) scale(${s})`;
      });
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
    };
  }, [running, slots, geo]);

  const activate = (i: number) => {
    const s = slots[i];
    if (coarse && hot !== i) {
      setHot(i); // toque: 1º seleciona, 2º abre
      return;
    }
    if (s.project) onOpen(s.index);
  };

  const hotSlot = hot !== null ? slots[hot] : null;

  return (
    <>
      <div
        id="stage"
        onClick={(e) => {
          if (coarse && !(e.target as HTMLElement).closest(".tile")) setHot(null);
        }}
      >
        <div id="ring" className={hot !== null ? "hovered" : ""}>
          {slots.map((s, i) => {
            const src = s.project?.thumb ?? s.project?.gif ?? paints[i];
            return (
            <button
              key={i}
              type="button"
              ref={(el) => {
                tileRefs.current[i] = el;
              }}
              className={`tile${hot === i ? " hot" : ""}${s.project ? "" : " soon"}`}
              style={{ zIndex: Math.round(geo[i].sf * 10) }}
              aria-label={s.project ? `${pad3(s.index + 1)} — ${s.project.title}` : t.ring.soon}
              aria-disabled={!s.project}
              tabIndex={s.project ? 0 : -1}
              onMouseEnter={coarse ? undefined : () => setHot(i)}
              onMouseLeave={coarse ? undefined : () => setHot(null)}
              onFocus={coarse ? undefined : () => setHot(i)}
              onBlur={coarse ? undefined : () => setHot(null)}
              onClick={() => activate(i)}
            >
              {src && (
                <img
                  ref={(el) => {
                    imgRefs.current[i] = el;
                  }}
                  src={src}
                  alt=""
                  draggable={false}
                />
              )}
            </button>
            );
          })}
        </div>
        <Mark id="mark" />
      </div>

      <div className={`hud${hotSlot ? " show" : ""}`} aria-hidden="true">
        <span className="idx">{hotSlot?.project ? pad3(hotSlot.index + 1) : "—"}</span>
        <span className="title">{hotSlot?.project ? hotSlot.project.title : t.ring.soon}</span>
        <span className="year">{hotSlot?.project ? hotSlot.project.date.slice(0, 4) : ""}</span>
      </div>
    </>
  );
}
