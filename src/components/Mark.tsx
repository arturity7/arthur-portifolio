"use client";

import { useEffect, useRef } from "react";

/* Marca "a" envolta por elipses que se abrem e fecham, como respiração. */
export default function Mark({ id, className }: { id?: string; className?: string }) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = ref.current;
    if (!svg || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ells = svg.querySelectorAll("ellipse");
    const a = svg.querySelector("text");
    let raf = 0;
    const frame = (t: number) => {
      const fan = Math.pow(Math.sin(((t % 2400) / 2400) * Math.PI), 1.6);
      ells.forEach((e, i) => {
        const k = i - (ells.length - 1) / 2;
        e.setAttribute("cx", String(50 + k * fan * 7.2));
        e.setAttribute("rx", String(27 - Math.abs(k) * fan * 1.4));
      });
      a?.setAttribute("x", String(50 + 2 * fan * 7.2));
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <svg ref={ref} id={id} className={`mark ${className ?? ""}`} viewBox="0 0 100 60" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => (
        <ellipse key={i} cx="50" cy="30" rx="27" ry="18" />
      ))}
      <text x="50" y="30" textAnchor="middle" dominantBaseline="central" fontSize="21" fill="currentColor">
        a
      </text>
    </svg>
  );
}
