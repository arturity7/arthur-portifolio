/* Utilitários visuais compartilhados: ruído em manchas, máscara pixelada e
   miniaturas procedurais para os espaços vazios do anel. */

/* manchas orgânicas — usadas no loader e no véu de meio-tom */
export const blotch = (x: number, y: number) =>
  (Math.sin(x * 0.011 + 1.7) * Math.sin(y * 0.014 + 0.4) +
    Math.sin(x * 0.004 - 2.1) * Math.sin(y * 0.006 + 3.3) +
    Math.sin((x + y) * 0.0065)) / 3;

/* máscara de borda pixelada para o "colapso" das páginas */
export function buildPixelMask(target: HTMLElement) {
  const c = document.createElement("canvas");
  const CW = 960, CH = 540, B = 24;
  c.width = CW;
  c.height = CH;
  const g = c.getContext("2d");
  if (!g) return;
  g.fillStyle = "#fff";
  for (let r = 0; r < CH / B; r++)
    for (let col = 0; col < CW / B; col++) {
      const nx = ((col + 0.5) / (CW / B)) * 2 - 1;
      const ny = ((r + 0.5) / (CH / B)) * 2 - 1;
      const d = Math.sqrt(nx * nx * 1.05 + ny * ny * 1.35);
      if (d + (Math.random() - 0.5) * 0.34 < 0.88) g.fillRect(col * B, r * B, B, B);
    }
  target.style.setProperty("--pixel-mask", `url("${c.toDataURL()}")`);
}

/* miniatura procedural (gradiente + vulto + grão) */
export function paintThumb(seed: number, w: number, h: number) {
  let s = (seed * 2654435761) % 4294967296;
  const rnd = () => ((s = (s * 1664525 + 1013904223) % 4294967296), s / 4294967296);
  const hues = [42, 210, 18, 320, 160, 265];
  const hue = hues[Math.floor(rnd() * hues.length)];
  const sat = rnd() < 0.4 ? 0.45 + rnd() * 0.3 : 0.06 + rnd() * 0.12;

  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const g = c.getContext("2d");
  if (!g) return "";
  let s2 = (seed * 97 + 13) % 4294967296;
  const r2 = () => ((s2 = (s2 * 1664525 + 1013904223) % 4294967296), s2 / 4294967296);

  const L1 = 18 + r2() * 22, L2 = 52 + r2() * 34;
  const ang = r2() * Math.PI * 2, R = Math.hypot(w, h) / 2;
  const gr = g.createLinearGradient(
    w / 2 - Math.cos(ang) * R, h / 2 - Math.sin(ang) * R,
    w / 2 + Math.cos(ang) * R, h / 2 + Math.sin(ang) * R,
  );
  gr.addColorStop(0, `hsl(${hue} ${sat * 100}% ${L1}%)`);
  gr.addColorStop(1, `hsl(${hue + 18} ${sat * 88}% ${L2}%)`);
  g.fillStyle = gr;
  g.fillRect(0, 0, w, h);

  const bx = w * (0.2 + r2() * 0.6), by = h * (0.25 + r2() * 0.5);
  const br = Math.min(w, h) * (0.35 + r2() * 0.45);
  const rg = g.createRadialGradient(bx, by, br * 0.08, bx, by, br);
  rg.addColorStop(0, r2() > 0.5 ? "rgba(8,8,10,.55)" : "rgba(244,243,240,.5)");
  rg.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = rg;
  g.fillRect(0, 0, w, h);

  const id = g.getImageData(0, 0, w, h), d = id.data;
  for (let i = 0; i < d.length; i += 4) {
    const n = (r2() - 0.5) * 16;
    d[i] += n; d[i + 1] += n; d[i + 2] += n;
  }
  g.putImageData(id, 0, 0);

  const vg = g.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.35, w / 2, h / 2, Math.hypot(w, h) / 1.6);
  vg.addColorStop(0, "rgba(0,0,0,0)");
  vg.addColorStop(1, "rgba(0,0,0,.26)");
  g.fillStyle = vg;
  g.fillRect(0, 0, w, h);
  return c.toDataURL("image/jpeg", 0.82);
}

export const pad3 = (n: number) => String(n).padStart(3, "0");
