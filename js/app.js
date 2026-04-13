/* ============================================
   FINCA LA RESERVA — app.js
   Open/Closed status + WhatsApp reservation
   ============================================ */

(function () {
  "use strict";

  /* ============================================
     1. OPEN / CLOSED STATUS
        Open days: Friday (5), Saturday (6), Sunday (0)
     ============================================ */
  function updateStatus() {
    const badge    = document.getElementById("statusBadge");
    if (!badge) return;

    const dot      = badge.querySelector(".badge-dot");
    const text     = badge.querySelector(".badge-text");

    const today    = new Date().getDay(); // 0=Sun, 5=Fri, 6=Sat
    const openDays = [0, 5, 6];
    const isOpen   = openDays.includes(today);

    if (isOpen) {
      dot.classList.add("open");
      dot.classList.remove("closed");
      text.textContent = "🟢 Abierto hoy — Visitanos";
    } else {
      dot.classList.remove("open");
      dot.classList.add("closed");
      text.textContent = "🔴 Cerrado hoy — Abrimos viernes a domingo";
    }
  }

  /* ============================================
     2. NAVBAR — sticky style + mobile toggle
     ============================================ */
  function initNavbar() {
    const navbar    = document.getElementById("navbar");
    const toggle    = document.getElementById("navToggle");
    const navLinks  = document.getElementById("navLinks");

    if (!navbar) return;

    // Scroll handler — add .scrolled class
    window.addEventListener("scroll", function () {
      if (window.scrollY > 60) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
    }, { passive: true });

    // Mobile toggle
    if (toggle && navLinks) {
      toggle.addEventListener("click", function () {
        const isOpen = navLinks.classList.toggle("open");
        toggle.setAttribute("aria-expanded", isOpen);
      });

      // Close menu when a link is clicked
      navLinks.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
          navLinks.classList.remove("open");
          toggle.setAttribute("aria-expanded", "false");
        });
      });
    }
  }

  /* ============================================
     3. WHATSAPP RESERVATION FORM
     ============================================ */
  function initReservaForm() {
    const form = document.getElementById("reservaForm");
    if (!form) return;

    // Set minimum date to today
    const dateInput = document.getElementById("fecha");
    if (dateInput) {
      const today = new Date();
      const yyyy  = today.getFullYear();
      const mm    = String(today.getMonth() + 1).padStart(2, "0");
      const dd    = String(today.getDate()).padStart(2, "0");
      dateInput.min = yyyy + "-" + mm + "-" + dd;
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const nombre      = (document.getElementById("nombre")?.value || "").trim();
      const personas    = (document.getElementById("personas")?.value || "").trim();
      const fecha       = (document.getElementById("fecha")?.value || "").trim();
      const hora        = (document.getElementById("hora")?.value || "").trim();
      const experiencia = (document.getElementById("experiencia")?.value || "").trim();

      // Basic validation
      if (!nombre || !personas || !fecha || !hora) {
        highlightEmpty([
          { id: "nombre",   val: nombre },
          { id: "personas", val: personas },
          { id: "fecha",    val: fecha },
          { id: "hora",     val: hora }
        ]);
        return;
      }

      // Format date to dd/mm/yyyy
      const [year, month, day] = fecha.split("-");
      const fechaFormatted = day + "/" + month + "/" + year;

      // Build message
      let message = "Hola! Quiero reservar una experiencia para *" + personas + " personas* el día *" + fechaFormatted + "* a las *" + hora + " hs*. Mi nombre es *" + nombre + "*.";

      if (experiencia) {
        message += " Experiencia de interés: *" + experiencia + "*.";
      }

      const encoded = encodeURIComponent(message);
      const waURL   = "https://wa.me/5492323521229?text=" + encoded;

      window.open(waURL, "_blank", "noopener,noreferrer");
    });
  }

  function highlightEmpty(fields) {
    fields.forEach(function (field) {
      if (!field.val) {
        const el = document.getElementById(field.id);
        if (el) {
          el.style.borderColor = "#EB5757";
          el.addEventListener("input", function () {
            el.style.borderColor = "";
          }, { once: true });
        }
      }
    });
  }

  /* ============================================
     4. SCROLL REVEAL
     ============================================ */
  function initReveal() {
    const items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: "0px 0px -40px 0px"
    });

    items.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ============================================
     5. SMOOTH SCROLL for anchor links
     ============================================ */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener("click", function (e) {
        const target = document.querySelector(this.getAttribute("href"));
        if (!target) return;
        e.preventDefault();
        const navH   = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--nav-h")) || 72;
        const top    = target.getBoundingClientRect().top + window.scrollY - navH;
        window.scrollTo({ top: top, behavior: "smooth" });
      });
    });
  }

  /* ============================================
     INIT
     ============================================ */
  document.addEventListener("DOMContentLoaded", function () {
    updateStatus();
    initNavbar();
    initReservaForm();
    initReveal();
    initSmoothScroll();
  });

})();