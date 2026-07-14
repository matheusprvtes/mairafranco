/* =========================================================
   Dra. Maíra Franco — LP · Interações
   Degradação elegante: o conteúdo funciona 100% sem este JS.
   ========================================================= */
(function () {
  "use strict";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Ano no rodapé */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* Navbar: fundo ao rolar */
  var nav = document.querySelector(".nav");
  function onScroll() { if (nav) nav.classList.toggle("scrolled", window.scrollY > 40); }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* Menu mobile */
  var toggle = document.getElementById("navToggle");
  var menu = document.getElementById("menu");
  function closeMenu() {
    if (!menu) return;
    menu.classList.remove("open");
    toggle.classList.remove("active");
    toggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
  }
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      toggle.classList.toggle("active", open);
      toggle.setAttribute("aria-expanded", String(open));
      document.body.classList.toggle("menu-open", open);
    });
    menu.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", closeMenu); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMenu(); });
  }

  /* Reveal on scroll */
  var revealEls = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("is-visible"); obs.unobserve(entry.target); }
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* FAQ: acordeão (fecha os demais) */
  var faqItems = document.querySelectorAll(".faq__item");
  faqItems.forEach(function (item) {
    item.addEventListener("toggle", function () {
      if (item.open) faqItems.forEach(function (o) { if (o !== item) o.open = false; });
    });
  });

  /* Parallax sutil no hero */
  var heroBg = document.querySelector(".hero__bg");
  if (heroBg && !reduceMotion) {
    var ticking = false;
    window.addEventListener("scroll", function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          var y = window.scrollY;
          if (y < window.innerHeight) heroBg.style.transform = "translateY(" + y * 0.15 + "px)";
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* Banner de cookies (LGPD) */
  var cookie = document.getElementById("cookie");
  var KEY = "mf_cookie_consent";
  try {
    if (cookie && !localStorage.getItem(KEY)) {
      setTimeout(function () { cookie.hidden = false; }, 1200);
    }
  } catch (e) {}
  function setConsent(v) {
    try { localStorage.setItem(KEY, v); } catch (e) {}
    if (cookie) cookie.hidden = true;
  }
  var accept = document.getElementById("cookieAccept");
  var decline = document.getElementById("cookieDecline");
  if (accept) accept.addEventListener("click", function () { setConsent("accepted"); });
  if (decline) decline.addEventListener("click", function () { setConsent("declined"); });

  /* Link externo ainda sem URL (Linktree) */
  document.querySelectorAll("[data-external='linktree']").forEach(function (l) {
    l.addEventListener("click", function (e) {
      if (l.getAttribute("href") === "#") {
        e.preventDefault();
        alert("O link do Linktree será disponibilizado em breve.");
      }
    });
  });

  /* Hook de tracking para CTAs (Meta/GA/GTM) */
  document.querySelectorAll("[data-cta]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var id = btn.getAttribute("data-cta");
      if (window.dataLayer) window.dataLayer.push({ event: "cta_whatsapp_click", cta_location: id });
      if (typeof window.fbq === "function") window.fbq("track", "Contact", { location: id });
    });
  });
})();
