// =============================================================================
// Gama de Mexico — Scripts principales del sitio
// Header scroll, menu movil, FAQ accordion, formularios, smooth scroll
// =============================================================================

(function () {
  'use strict';

  // ── Header scroll effect ──
  const header = document.getElementById('header');

  if (header) {
    function onScroll() {
      const currentScroll = window.pageYOffset;
      if (currentScroll > 10) {
        header!.classList.add('header--scrolled');
      } else {
        header!.classList.remove('header--scrolled');
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // ── Mobile menu ──
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileOverlay = document.getElementById('mobile-overlay');

  if (hamburger && mobileNav && mobileOverlay) {
    let isMenuOpen = false;

    function openMenu() {
      isMenuOpen = true;
      hamburger.classList.add('hamburger--active');
      hamburger.setAttribute('aria-expanded', 'true');
      mobileNav.classList.add('mobile-nav--active');
      mobileNav.setAttribute('aria-hidden', 'false');
      mobileOverlay.classList.add('mobile-overlay--active');
      mobileOverlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';

      const firstLink = mobileNav.querySelector('a, button') as HTMLElement | null;
      if (firstLink) firstLink.focus();
    }

    function closeMenu() {
      isMenuOpen = false;
      hamburger.classList.remove('hamburger--active');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileNav.classList.remove('mobile-nav--active');
      mobileNav.setAttribute('aria-hidden', 'true');
      mobileOverlay.classList.remove('mobile-overlay--active');
      mobileOverlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      hamburger.focus();
    }

    hamburger.addEventListener('click', function () {
      if (isMenuOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    mobileOverlay.addEventListener('click', closeMenu);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isMenuOpen) {
        closeMenu();
      }
    });

    // ── Focus trap in mobile nav ──
    mobileNav.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      const focusable = mobileNav.querySelectorAll(
        'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as NodeListOf<HTMLElement>;
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });

    // ── Close mobile menu on anchor clicks ──
    const mobileLinks = mobileNav.querySelectorAll('a[href^="#"]');
    mobileLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        closeMenu();
      });
    });

    // ── Mobile submenu toggle — Equipos ──
    const toggleEquipos = document.getElementById('mobile-toggle-equipos');
    if (toggleEquipos) {
      toggleEquipos.addEventListener('click', function () {
        const submenu = document.getElementById('mobile-submenu-equipos');
        const arrow = this.querySelector('.mobile-nav__arrow') as HTMLElement | null;
        const isOpen = this.getAttribute('aria-expanded') === 'true';

        this.setAttribute('aria-expanded', String(!isOpen));
        submenu?.classList.toggle('mobile-nav__submenu--open');
        if (arrow) arrow.classList.toggle('mobile-nav__arrow--open');
      });
    }

    // ── Mobile submenu toggle — Servicios ──
    const toggleServicios = document.getElementById('mobile-toggle-servicios');
    if (toggleServicios) {
      toggleServicios.addEventListener('click', function () {
        const submenu = document.getElementById('mobile-submenu-servicios');
        const arrow = this.querySelector('.mobile-nav__arrow') as HTMLElement | null;
        const isOpen = this.getAttribute('aria-expanded') === 'true';

        this.setAttribute('aria-expanded', String(!isOpen));
        submenu?.classList.toggle('mobile-nav__submenu--open');
        if (arrow) arrow.classList.toggle('mobile-nav__arrow--open');
      });
    }
  }

  // ── FAQ accordion ──
  const faqButtons = document.querySelectorAll('.faq__question');
  if (faqButtons.length > 0) {
    function setFaqState(btn: Element, expanded: boolean) {
      const answerId = btn.getAttribute('aria-controls');
      const answer = answerId ? document.getElementById(answerId) : null;
      const icon = btn.querySelector('.faq__icon');
      btn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      if (icon) icon.textContent = expanded ? '−' : '+';
      if (answer) {
        answer.classList.toggle('faq__answer--open', expanded);
        (answer as HTMLElement).hidden = !expanded;
      }
    }

    // Estado inicial consistente.
    faqButtons.forEach(function (btn, index) {
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';
      setFaqState(btn, index === 0 ? isExpanded : false);
    });

    faqButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const isExpanded = this.getAttribute('aria-expanded') === 'true';

        faqButtons.forEach(function (otherBtn) {
          setFaqState(otherBtn, false);
        });

        if (!isExpanded) {
          setFaqState(this, true);
        }
      });
    });
  }

  // ── WhatsApp form (homepage) ──
  const cotizarForm = document.getElementById('cotizar-form');
  if (cotizarForm) {
    cotizarForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const nombre = (document.getElementById('lead-nombre') as HTMLInputElement)?.value.trim();
      const contacto = (document.getElementById('lead-contacto') as HTMLInputElement)?.value.trim();
      const equipo =
        (document.getElementById('lead-equipo') as HTMLSelectElement)?.value ||
        (document.getElementById('lead-servicio') as HTMLSelectElement)?.value;

      if (!nombre || !contacto || !equipo) return;

      const mensaje =
        'Hola, soy *' + nombre + '*.\n' +
        'Me interesa cotizar: *' + equipo + '*.\n' +
        'Mi contacto: ' + contacto + '.\n' +
        'Solicito información de precios y disponibilidad. Gracias.';

      const url = 'https://wa.me/5215565298240?text=' + encodeURIComponent(mensaje);
      window.open(url, '_blank', 'noopener');
    });
  }

  // ── Smooth scroll ──
  function getStickyOffset(): number {
    const styles = getComputedStyle(document.documentElement);
    const headerHeight = Number.parseFloat(styles.getPropertyValue('--header-height')) || 0;
    const topbarHeight = Number.parseFloat(styles.getPropertyValue('--topbar-height')) || 0;
    return headerHeight + topbarHeight + 12;
  }

  function scrollToHashTarget(targetId: string): boolean {
    if (!targetId || targetId === '#') return false;

    const target = document.querySelector(targetId);
    if (!target) return false;

    const offsetPosition = target.getBoundingClientRect().top + window.pageYOffset - getStickyOffset();
    window.scrollTo({
      top: Math.max(0, offsetPosition),
      behavior: 'smooth',
    });

    return true;
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = (this as HTMLAnchorElement).getAttribute('href');
      if (!targetId || targetId === '#') return;

      if (scrollToHashTarget(targetId)) {
        e.preventDefault();
        return;
      }

      if (targetId === '#cotizar') {
        e.preventDefault();
        window.location.href = `/${targetId}`;
      }
    });
  });

  if (window.location.hash) {
    window.requestAnimationFrame(function () {
      scrollToHashTarget(window.location.hash);
    });
  }
})();
