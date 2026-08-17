/**
 * IGAKI TATSUSHI - Portfolio interactions
 * Navigation, scroll reveals, accessible modals and responsive behavior.
 */

document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('header');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileNavDrawer = document.getElementById('mobileNavDrawer');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const handleScroll = () => {
    header?.classList.toggle('scrolled', window.scrollY > 40);
  };

  const closeMobileMenu = () => {
    mobileNavDrawer?.classList.remove('open');
    mobileMenuBtn?.classList.remove('open');
    mobileMenuBtn?.setAttribute('aria-expanded', 'false');
    mobileMenuBtn?.setAttribute('aria-label', 'メニューを開く');
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  if (mobileMenuBtn && mobileNavDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      const willOpen = !mobileNavDrawer.classList.contains('open');
      mobileNavDrawer.classList.toggle('open', willOpen);
      mobileMenuBtn.classList.toggle('open', willOpen);
      mobileMenuBtn.setAttribute('aria-expanded', String(willOpen));
      mobileMenuBtn.setAttribute('aria-label', willOpen ? 'メニューを閉じる' : 'メニューを開く');
    });

    mobileNavDrawer.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMobileMenu);
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 960) closeMobileMenu();
    });
  }

  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if ('IntersectionObserver' in window) {
    const spyObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      });
    }, {
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    });

    sections.forEach((section) => spyObserver.observe(section));
  }

  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const staggerGroups = document.querySelectorAll(
    '.approaches-grid, .works-list, .achievements-grid, .capabilities-grid, .contact-grid'
  );

  staggerGroups.forEach((group) => {
    group.querySelectorAll(':scope > .reveal-on-scroll').forEach((element, index) => {
      element.style.setProperty('--reveal-delay', `${Math.min(index * 70, 280)}ms`);
    });
  });

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealElements.forEach((element) => element.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach((element) => revealObserver.observe(element));
  }

  let activeModal = null;
  let previouslyFocusedElement = null;

  const getFocusableElements = (modal) => Array.from(modal.querySelectorAll(
    'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  )).filter((element) => !element.hasAttribute('hidden'));

  const openModal = (modal) => {
    if (!modal) return;
    previouslyFocusedElement = document.activeElement;
    activeModal = modal;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    window.requestAnimationFrame(() => getFocusableElements(modal)[0]?.focus());
  };

  const closeModal = (modal = activeModal) => {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    activeModal = null;
    previouslyFocusedElement?.focus();
    previouslyFocusedElement = null;
  };

  const imageModal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImage');
  const modalCaption = document.getElementById('modalCaption');
  const modalCloseBtn = document.getElementById('modalCloseBtn');

  document.querySelectorAll('.image-modal-trigger').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      if (!imageModal || !modalImg) return;
      modalImg.src = trigger.dataset.image || '';
      modalImg.alt = trigger.dataset.alt || 'Preview';
      if (modalCaption) modalCaption.textContent = trigger.dataset.caption || trigger.dataset.alt || '';
      openModal(imageModal);
    });
  });

  modalCloseBtn?.addEventListener('click', () => closeModal(imageModal));
  imageModal?.addEventListener('click', (event) => {
    if (event.target === imageModal) closeModal(imageModal);
  });

  const contactModal = document.getElementById('contactModal');
  const contactCloseBtn = document.getElementById('contactCloseBtn');

  document.querySelectorAll('.open-contact-modal').forEach((button) => {
    button.addEventListener('click', () => openModal(contactModal));
  });

  contactCloseBtn?.addEventListener('click', () => closeModal(contactModal));
  contactModal?.addEventListener('click', (event) => {
    if (event.target === contactModal) closeModal(contactModal);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      if (activeModal) closeModal(activeModal);
      else closeMobileMenu();
      return;
    }

    if (event.key !== 'Tab' || !activeModal) return;
    const focusable = getFocusableElements(activeModal);
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
});
