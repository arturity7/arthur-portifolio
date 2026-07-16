(() => {
  "use strict";

  document.getElementById("year").textContent = new Date().getFullYear();

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasGSAP = typeof gsap !== "undefined";

  /* ---------------- Loader ---------------- */
  const loader = document.getElementById("loader");
  window.addEventListener("load", () => {
    setTimeout(() => loader.classList.add("done"), reduced ? 0 : 900);
  });
  // fallback caso 'load' demore (imagens grandes)
  setTimeout(() => loader.classList.add("done"), 2600);

  /* ---------------- Nav: sólida ao rolar, clara sobre o hero ---------------- */
  const nav = document.getElementById("nav");
  const hero = document.querySelector(".hero");

  const updateNav = () => {
    const y = window.scrollY;
    nav.classList.toggle("solid", y > 60);
    nav.classList.toggle("on-hero", y < hero.offsetHeight - 80);
  };
  window.addEventListener("scroll", updateNav, { passive: true });
  updateNav();

  /* ---------------- Menu overlay ---------------- */
  const menuBtn = document.getElementById("menuBtn");
  const overlay = document.getElementById("menuOverlay");

  const setMenu = (open) => {
    overlay.classList.toggle("open", open);
    overlay.setAttribute("aria-hidden", String(!open));
    menuBtn.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
    if (open) nav.classList.remove("on-hero");
    else updateNav();
  };

  menuBtn.addEventListener("click", () =>
    setMenu(!overlay.classList.contains("open"))
  );
  overlay.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => setMenu(false))
  );
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setMenu(false);
  });

  /* ---------------- Sem GSAP ou com motion reduzido: mostra tudo ---------------- */
  if (!hasGSAP || reduced) {
    document
      .querySelectorAll("[data-reveal],[data-lines],.hero-script")
      .forEach((el) => {
        el.style.opacity = 1;
        el.style.transform = "none";
      });
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  /* ---------------- Hero: título letra a letra + script ---------------- */
  const caps = document.querySelector(".hero-caps");
  if (caps) {
    const text = caps.textContent;
    caps.textContent = "";
    [...text].forEach((ch) => {
      const s = document.createElement("span");
      s.className = "ch";
      s.textContent = ch;
      caps.appendChild(s);
    });

    gsap.set(".hero-caps .ch", { yPercent: 110, opacity: 0 });
    gsap.to(".hero-caps .ch", {
      yPercent: 0,
      opacity: 1,
      duration: 1.4,
      ease: "expo.out",
      stagger: 0.055,
      delay: 1.1,
    });
  }

  gsap.to(".hero-script", {
    opacity: 1,
    duration: 1.6,
    ease: "power2.out",
    delay: 1.9,
  });

  gsap.fromTo(
    ".hero-card, .hero-tag",
    { opacity: 0, y: 24 },
    { opacity: 1, y: 0, duration: 1.2, ease: "power3.out", delay: 2.1, stagger: 0.12 }
  );

  /* parallax sutil da foto do hero */
  gsap.to("#heroImg", {
    yPercent: 12,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
  });

  /* ---------------- Reveals genéricos ---------------- */
  document.querySelectorAll("[data-reveal]").forEach((el) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 1.3,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 86%" },
    });
  });

  document.querySelectorAll("[data-lines]").forEach((el) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 1.6,
      ease: "expo.out",
      scrollTrigger: { trigger: el, start: "top 84%" },
    });
  });

  /* ---------------- Imagens: zoom-out lento ao entrar ---------------- */
  document.querySelectorAll("[data-parallax] img").forEach((img) => {
    gsap.to(img, {
      scale: 1,
      duration: 2,
      ease: "power2.out",
      scrollTrigger: { trigger: img, start: "top 88%" },
    });
    gsap.to(img, {
      yPercent: 6,
      ease: "none",
      scrollTrigger: {
        trigger: img,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  });

  /* ---------------- Itens da galeria: leve escala ---------------- */
  document.querySelectorAll(".cel-item img").forEach((img) => {
    gsap.fromTo(
      img,
      { scale: 1.08 },
      {
        scale: 1,
        duration: 2,
        ease: "power2.out",
        scrollTrigger: { trigger: img, start: "top 90%" },
      }
    );
  });
})();
