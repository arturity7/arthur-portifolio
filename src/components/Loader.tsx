"use client";

import { useEffect, useRef, useState } from "react";
import Mark from "./Mark";
import { blotch } from "@/lib/visual";

type Dot = { x: number; y: number; th: number; tw: number };

/* Tela de entrada: campo de pontos que se apaga em manchas conforme o progresso. */
export default function Loader({ onDone }: { onDone: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pct, setPct] = useState(0);
  const [off, setOff] = useState(false);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    const cv = canvasRef.current!;
    const ctx = cv.getContext("2d")!;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const DPR = Math.min(2, devicePixelRatio || 1);
    let dots: Dot[] = [];
    let progress = 0;
    let running = true;

    const build = () => {
      cv.width = innerWidth * DPR;
      cv.height = innerHeight * DPR;
      cv.style.width = innerWidth + "px";
      cv.style.height = innerHeight + "px";
      dots = [];
      const GAP = 15 * DPR, jit = 1.2 * DPR;
      for (let y = GAP * 0.6; y < cv.height; y += GAP)
        for (let x = GAP * 0.6; x < cv.width; x += GAP)
          dots.push({
            x: x + (Math.random() - 0.5) * jit * 2,
            y: y + (Math.random() - 0.5) * jit * 2,
            th: Math.min(1, Math.max(0, 0.5 + blotch(x / DPR, y / DPR) * 0.42 + (Math.random() - 0.5) * 0.22)),
            tw: Math.random() * Math.PI * 2,
          });
    };
    build();
    let rsT: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(rsT);
      rsT = setTimeout(build, 150);
    };
    addEventListener("resize", onResize);

    const draw = (t: number) => {
      if (!running) return;
      ctx.clearRect(0, 0, cv.width, cv.height);
      const r = 1.05 * DPR;
      ctx.fillStyle = "#f2f1ee";
      for (const d of dots) {
        if (d.th < progress) continue;
        const flick = 0.22 + 0.16 * Math.sin(t * 0.0016 + d.tw) + 0.08 * Math.sin(t * 0.006 + d.tw * 3.1);
        const near = d.th - progress < 0.06 ? 0.5 + 0.5 * Math.sin(t * 0.02 + d.tw) : 1;
        ctx.globalAlpha = Math.max(0, flick * near);
        ctx.beginPath();
        ctx.arc(d.x, d.y, r, 0, 6.2832);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      requestAnimationFrame(draw);
    };
    requestAnimationFrame(draw);

    /* progresso "orgânico": rápido no começo, desacelera no fim */
    let p = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const step = () => {
      p = Math.min(100, p + Math.max(2, Math.random() * (100 - p) * 0.22 + 3));
      setPct(Math.floor(p));
      progress = (p / 100) * 0.92;
      if (p < 100) timers.push(setTimeout(step, 70 + Math.random() * 110));
      else
        timers.push(
          setTimeout(() => {
            setOff(true);
            doneRef.current();
            timers.push(setTimeout(() => (running = false), 600));
          }, 300),
        );
    };
    timers.push(setTimeout(step, reduced ? 0 : 400));

    return () => {
      running = false;
      timers.forEach(clearTimeout);
      clearTimeout(rsT);
      removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div id="loader" className={off ? "off" : ""} aria-hidden="true">
      <canvas ref={canvasRef} />
      <Mark id="lmark" />
      <div id="pct">{pct}%</div>
    </div>
  );
}
