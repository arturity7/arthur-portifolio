(() => {
  "use strict";

  document.getElementById("year").textContent = new Date().getFullYear();

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasGSAP = typeof gsap !== "undefined";

  /* ---------- Nav ---------- */
  const nav = document.getElementById("nav");
  const hero = document.querySelector(".hero");

  const onScroll = () => {
    nav.classList.toggle("solid", window.scrollY > 50);
    nav.classList.toggle("on-hero", window.scrollY < hero.offsetHeight - 90);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  nav.classList.add("on-hero");

  /* ---------- Menu mobile ---------- */
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");

  const setMenu = (open) => {
    links.classList.toggle("open", open);
    nav.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
  };
  toggle.addEventListener("click", () => setMenu(!links.classList.contains("open")));
  links.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));

  /* ---------- FAQ: fecha os outros ao abrir ---------- */
  const faqs = document.querySelectorAll(".faq details");
  faqs.forEach((d) => {
    d.addEventListener("toggle", () => {
      if (d.open) faqs.forEach((o) => { if (o !== d) o.open = false; });
    });
  });

  /* ---------- Sem GSAP / motion reduzido: tudo visível ---------- */
  if (!hasGSAP || reduced) {
    document.querySelectorAll("[data-fade],[data-reveal],[data-stagger] > *, [data-line]")
      .forEach((el) => { el.style.opacity = 1; el.style.transform = "none"; });
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  /* ---------- Hero: linhas do título sobem em sequência ---------- */
  document.querySelectorAll(".hero-title [data-line]").forEach((line, i) => {
    const inner = document.createElement("span");
    inner.style.display = "inline-block";
    inner.innerHTML = line.innerHTML;
    line.innerHTML = "";
    line.appendChild(inner);
    gsap.fromTo(inner,
      { yPercent: 110 },
      { yPercent: 0, duration: 1.1, ease: "expo.out", delay: 0.25 + i * 0.1 }
    );
  });

  gsap.utils.toArray(".hero [data-fade]").forEach((el, i) => {
    gsap.fromTo(el,
      { opacity: 0, y: 26 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.7 + i * 0.15 }
    );
  });

  /* parallax do hero */
  gsap.to("#heroImg", {
    yPercent: 10, ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
  });

  /* ---------- Reveals por scroll ---------- */
  gsap.utils.toArray("main [data-fade]").forEach((el) => {
    if (el.closest(".hero")) return;
    gsap.to(el, {
      opacity: 1, y: 0, duration: 1.1, ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 87%" }
    });
  });

  gsap.utils.toArray("[data-reveal]").forEach((el) => {
    gsap.to(el, {
      opacity: 1, y: 0, scale: 1, duration: 1.3, ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 85%" }
    });
  });

  gsap.utils.toArray("[data-stagger]").forEach((group) => {
    gsap.to(group.children, {
      opacity: 1, y: 0, duration: 1, ease: "power3.out",
      stagger: 0.12,
      scrollTrigger: { trigger: group, start: "top 85%" }
    });
  });

  /* ---------- FAQ: abre com animação de altura ---------- */
  faqs.forEach((d) => {
    const body = d.querySelector(".faq-body");
    d.addEventListener("toggle", () => {
      if (d.open) {
        gsap.fromTo(body, { height: 0, opacity: 0 },
          { height: "auto", opacity: 1, duration: 0.5, ease: "power2.out" });
      }
    });
  });

  /* ---------- Botão WhatsApp: entra depois de rolar ---------- */
  const wa = document.querySelector(".wa-float");
  gsap.set(wa, { scale: 0, opacity: 0 });
  ScrollTrigger.create({
    start: "top -300",
    onEnter: () => gsap.to(wa, { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.8)" }),
    onLeaveBack: () => gsap.to(wa, { scale: 0, opacity: 0, duration: 0.3 })
  });
})();
