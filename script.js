/* =====================================================
   BIOSBEEPLAB — script.js
   Controla loader, reloj, navegación, partículas,
   animaciones de scroll, scroll-to-top y acordeones.
===================================================== */

(function () {
  "use strict";

  /* ---------- LOADER ---------- */
  window.addEventListener("load", () => {
    const loader = document.getElementById("loader");
    setTimeout(() => loader && loader.classList.add("hidden"), 900);
  });

  /* ---------- RELOJ Y FECHA ---------- */
  const clockEl = document.getElementById("clock");
  const dateEl = document.getElementById("date");
  const yearEl = document.getElementById("year");
  const pad = (n) => String(n).padStart(2, "0");
  const meses = ["enero","febrero","marzo","abril","mayo","junio",
                 "julio","agosto","septiembre","octubre","noviembre","diciembre"];
  const dias = ["domingo","lunes","martes","miércoles","jueves","viernes","sábado"];

  function tick() {
    const d = new Date();
    if (clockEl) clockEl.textContent = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    if (dateEl)  dateEl.textContent  = `${dias[d.getDay()]} ${d.getDate()} ${meses[d.getMonth()]} ${d.getFullYear()}`;
  }
  tick();
  setInterval(tick, 1000);
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- NAVEGACIÓN SUAVE ---------- */
  const navBtns = document.querySelectorAll("[data-target]");
  navBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-target");
      const target = document.getElementById(id);
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  /* ---------- HIGHLIGHT NAV ACTIVO ---------- */
  const sections = document.querySelectorAll("main section[id]");
  const topNavBtns = document.querySelectorAll(".nav-btn");
  const onScroll = () => {
    const y = window.scrollY + 140;
    let current = "";
    sections.forEach((s) => { if (s.offsetTop <= y) current = s.id; });
    topNavBtns.forEach((b) => {
      b.classList.toggle("active", b.getAttribute("data-target") === current);
    });
  };
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- BOTÓN VOLVER ARRIBA ---------- */
  const toTop = document.getElementById("toTop");
  window.addEventListener("scroll", () => {
    if (!toTop) return;
    toTop.classList.toggle("visible", window.scrollY > 500);
  }, { passive: true });
  if (toTop) toTop.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" })
  );

  /* ---------- ANIMACIONES AL SCROLL ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("visible"));
  }

  /* ---------- PARTÍCULAS DE FONDO ---------- */
  const canvas = document.getElementById("particles");
  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext("2d");
    let w, h, particles = [];

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    const COUNT = Math.min(80, Math.floor((window.innerWidth * window.innerHeight) / 18000));
    for (let i = 0; i < COUNT; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.6 + 0.4,
        c: Math.random() > 0.5 ? "0,217,255" : "57,255,20"
      });
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      // líneas entre partículas cercanas
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x, dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            ctx.strokeStyle = `rgba(${p.c},${(1 - dist / 110) * 0.18})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
      }
      // puntos
      particles.forEach((p) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.fillStyle = `rgba(${p.c},0.85)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
      requestAnimationFrame(draw);
    }
    draw();
  }

  /* ---------- ACCESIBILIDAD: keyboard nav-btn ---------- */
  navBtns.forEach((btn) => {
    btn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        btn.click();
      }
    });
  });

})();
