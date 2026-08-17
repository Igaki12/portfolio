/**
 * IGAKI TATSUSHI - Portfolio LP Main Script
 * Smooth Scrolling, ScrollSpy, Lightbox, Toast Notifications & Interactivity
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Header Scroll Effect
  const header = document.getElementById('header');
  const handleScroll = () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // 2. Mobile Menu Drawer
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileNavDrawer = document.getElementById('mobileNavDrawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileMenuBtn && mobileNavDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = mobileNavDrawer.classList.contains('open');
      if (isOpen) {
        mobileNavDrawer.classList.remove('open');
        mobileMenuBtn.classList.remove('open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      } else {
        mobileNavDrawer.classList.add('open');
        mobileMenuBtn.classList.add('open');
        mobileMenuBtn.setAttribute('aria-expanded', 'true');
      }
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileNavDrawer.classList.remove('open');
        mobileMenuBtn.classList.remove('open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 3. ScrollSpy & Active Navigation
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => spyObserver.observe(section));

  // 4. Scroll Reveal Animations
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    threshold: 0.12,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // 5. Toast Notification Helper
  const toastContainer = document.getElementById('toastContainer');
  window.showToast = function(message, duration = 3000) {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
      <span>${message}</span>
    `;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  };

  // 6. Copy Email to Clipboard
  const copyEmailBtns = document.querySelectorAll('.copy-email-btn');
  copyEmailBtns.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const email = 'igatatsu1997@gmail.com';
      try {
        await navigator.clipboard.writeText(email);
        window.showToast('メールアドレスをクリップボードにコピーしました！');
      } catch (err) {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = email;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        window.showToast('メールアドレスをコピーしました！');
      }
    });
  });

  // 7. Lightbox Image Modal
  const imageModal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImage');
  const modalCaption = document.getElementById('modalCaption');
  const modalCloseBtn = document.getElementById('modalCloseBtn');

  window.openImageModal = function(src, alt, caption) {
    if (!imageModal || !modalImg) return;
    modalImg.src = src;
    modalImg.alt = alt || 'Preview';
    if (modalCaption) {
      modalCaption.textContent = caption || alt || '';
    }
    imageModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeImageModal = () => {
    if (!imageModal) return;
    imageModal.classList.remove('open');
    document.body.style.overflow = '';
  };

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeImageModal);
  }

  if (imageModal) {
    imageModal.addEventListener('click', (e) => {
      if (e.target === imageModal) {
        closeImageModal();
      }
    });
  }

  // 8. Contact Consultation Modal
  const contactModal = document.getElementById('contactModal');
  const contactCloseBtn = document.getElementById('contactCloseBtn');
  const openContactBtns = document.querySelectorAll('.open-contact-modal');
  const contactForm = document.getElementById('consultationForm');

  window.openContactModal = function() {
    if (!contactModal) return;
    contactModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeContactModal = () => {
    if (!contactModal) return;
    contactModal.classList.remove('open');
    document.body.style.overflow = '';
  };

  openContactBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.openContactModal();
    });
  });

  if (contactCloseBtn) {
    contactCloseBtn.addEventListener('click', closeContactModal);
  }

  if (contactModal) {
    contactModal.addEventListener('click', (e) => {
      if (e.target === contactModal) {
        closeContactModal();
      }
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const subject = encodeURIComponent(contactForm.querySelector('[name="subject"]')?.value || 'ポートフォリオからの案件相談・お問い合わせ');
      const body = encodeURIComponent(`【お名前・ご所属】\n${contactForm.querySelector('[name="name"]')?.value || ''}\n\n【メールアドレス】\n${contactForm.querySelector('[name="email"]')?.value || ''}\n\n【ご相談内容】\n${contactForm.querySelector('[name="message"]')?.value || ''}`);
      
      // Open Mailto
      window.location.href = `mailto:igatatsu1997@gmail.com?subject=${subject}&body=${body}`;
      
      window.showToast('メーラーを起動しました。送信を完了してください。');
      closeContactModal();
      contactForm.reset();
    });
  }

  // Close modals on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeImageModal();
      closeContactModal();
    }
  });
});
