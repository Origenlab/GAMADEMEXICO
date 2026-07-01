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
  const mobileNav  = document.getElementById('mobile-nav');
  const mobileOverlay = document.getElementById('mobile-overlay');

  if (hamburger && mobileNav && mobileOverlay) {
    let isMenuOpen = false;

    // ── Submenu helpers ──
    // Selects all accordion toggles generically — works with any items defined in navigation.ts.
    const submenuToggles = mobileNav.querySelectorAll<HTMLButtonElement>('[id^="mobile-toggle-"]');

    function getSubmenuPanel(btn: HTMLButtonElement): HTMLElement | null {
      const id = btn.getAttribute('aria-controls');
      return id ? document.getElementById(id) : null;
    }

    function closeSubmenu(btn: HTMLButtonElement) {
      const panel = getSubmenuPanel(btn);
      const arrow = btn.querySelector<HTMLElement>('.mobile-nav__arrow');
      btn.setAttribute('aria-expanded', 'false');
      panel?.classList.remove('mobile-nav__submenu--open');
      // inert hides the panel from keyboard/AT while it's collapsed
      if (panel) panel.setAttribute('inert', '');
      if (arrow) arrow.classList.remove('mobile-nav__arrow--open');
    }

    function openSubmenu(btn: HTMLButtonElement) {
      const panel = getSubmenuPanel(btn);
      const arrow = btn.querySelector<HTMLElement>('.mobile-nav__arrow');
      btn.setAttribute('aria-expanded', 'true');
      panel?.classList.add('mobile-nav__submenu--open');
      if (panel) panel.removeAttribute('inert');
      if (arrow) arrow.classList.add('mobile-nav__arrow--open');
    }

    // Initialize: all submenus collapsed + inert
    submenuToggles.forEach((btn) => closeSubmenu(btn));

    // Accordion toggle — opening one closes all others
    submenuToggles.forEach((btn) => {
      btn.addEventListener('click', function () {
        const isOpen = btn.getAttribute('aria-expanded') === 'true';
        submenuToggles.forEach(closeSubmenu);
        if (!isOpen) openSubmenu(btn);
      });
    });

    // ── Menu open/close ──
    function openMenu() {
      isMenuOpen = true;
      hamburger!.classList.add('hamburger--active');
      hamburger!.setAttribute('aria-expanded', 'true');
      mobileNav!.classList.add('mobile-nav--active');
      mobileNav!.setAttribute('aria-hidden', 'false');
      mobileNav!.removeAttribute('inert');
      mobileOverlay!.classList.add('mobile-overlay--active');
      mobileOverlay!.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      // Focus first interactive element
      const firstFocusable = mobileNav!.querySelector<HTMLElement>('a, button');
      firstFocusable?.focus();
    }

    function closeMenu() {
      isMenuOpen = false;
      // Reset all submenus on close so menu reopens clean
      submenuToggles.forEach(closeSubmenu);
      hamburger!.classList.remove('hamburger--active');
      hamburger!.setAttribute('aria-expanded', 'false');
      mobileNav!.classList.remove('mobile-nav--active');
      mobileNav!.setAttribute('aria-hidden', 'true');
      mobileNav!.setAttribute('inert', '');
      mobileOverlay!.classList.remove('mobile-overlay--active');
      mobileOverlay!.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      hamburger!.focus();
    }

    hamburger.addEventListener('click', function () {
      if (isMenuOpen) { closeMenu(); } else { openMenu(); }
    });

    mobileOverlay.addEventListener('click', closeMenu);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isMenuOpen) closeMenu();
    });

    // ── Focus trap ──
    // Excludes elements inside [inert] panels (collapsed submenus).
    mobileNav.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      const focusable = Array.from(
        mobileNav!.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => !el.closest('[inert]'));

      if (focusable.length === 0) return;
      const first = focusable[0];
      const last  = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });

    // ── Close on anchor click (smooth-scroll targets) ──
    mobileNav.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });
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
        const isExpanded = btn.getAttribute('aria-expanded') === 'true';

        faqButtons.forEach(function (otherBtn) {
          setFaqState(otherBtn, false);
        });

        if (!isExpanded) {
          setFaqState(btn, true);
        }
      });
    });
  }

  // ── WhatsApp form (homepage) ──
  const cotizarForm = document.getElementById('cotizar-form');
  if (cotizarForm) {
    cotizarForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const nombre   = (document.getElementById('lead-nombre')   as HTMLInputElement)?.value.trim();
      const contacto = (document.getElementById('lead-contacto') as HTMLInputElement)?.value.trim();
      const equipo   =
        (document.getElementById('lead-equipo')   as HTMLSelectElement)?.value ||
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
      const targetId = anchor.getAttribute('href');
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
