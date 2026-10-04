/* ============================================================
   Hoang Nam Nguyen — Portfolio
   Plain JavaScript. No libraries.
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Theme toggle (remembers your choice) ---------- */
  var root = document.documentElement;
  var themeBtn = document.getElementById("themeToggle");

  try {
    var saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") root.setAttribute("data-theme", saved);
  } catch (e) { /* private mode — just use the system theme */ }

  themeBtn.addEventListener("click", function () {
    var systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    var current = root.getAttribute("data-theme") || (systemDark ? "dark" : "light");
    var next = current === "dark" ? "light" : "dark";

    root.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) { /* ignore */ }
  });

  /* ---------- Mobile menu ---------- */
  var navToggle = document.getElementById("navToggle");
  var navMenu = document.getElementById("navMenu");

  function closeMenu() {
    navMenu.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
  }

  navToggle.addEventListener("click", function () {
    var open = navMenu.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });

  navMenu.addEventListener("click", function (ev) {
    if (ev.target.tagName === "A") closeMenu();
  });

  document.addEventListener("keydown", function (ev) {
    if (ev.key === "Escape") closeMenu();
  });

  /* ---------- Header border once scrolled ---------- */
  var header = document.querySelector(".site-header");
  function onScroll() {
    header.classList.toggle("is-stuck", window.scrollY > 8);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Highlight the section you're reading ---------- */
  var links = Array.prototype.slice.call(navMenu.querySelectorAll("a"));
  var sections = links
    .map(function (a) { return document.querySelector(a.getAttribute("href")); })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) {
          a.classList.toggle("is-active", a.getAttribute("href") === "#" + entry.target.id);
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });

    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Fade sections in as they scroll into view ---------- */
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var targets = document.querySelectorAll(
    ".section__kicker, .section__title, .section__lead, .about, .card, .tl, .panel, .contact__item"
  );

  if (!reduceMotion && "IntersectionObserver" in window) {
    var reveal = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry, i) {
        if (!entry.isIntersecting) return;
        entry.target.style.transitionDelay = Math.min(i * 70, 280) + "ms";
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

    targets.forEach(function (el) {
      el.classList.add("reveal");
      reveal.observe(el);
    });
  }

  /* ---------- Footer year ---------- */
  document.getElementById("year").textContent = String(new Date().getFullYear());
})();
