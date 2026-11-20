
/* =========================================================
   CODEX PORTFOLIO — MAIN JAVASCRIPT
   Google Apps Script Contact Form Integration
========================================================= */

'use strict';

/* ================= CONFIGURATION ================= */

const GOOGLE_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbzqYFHc-C6rSYl-w2CtOpeVDG1wxbmi5jghGDCQaxeugOivUih0nz46wSKKO681E01oTQ/exec';

const WHATSAPP_NUMBER = ''; // ضع رقم واتساب بصيغة دولية بدون +

/* ================= HELPERS ================= */

const $ = (selector, parent = document) =>
  parent.querySelector(selector);

const $$ = (selector, parent = document) =>
  [...parent.querySelectorAll(selector)];

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function setStatus(element, message, type = 'info') {
  if (!element) return;

  element.textContent = message;
  element.dataset.state = type;
  element.classList.remove('success', 'error', 'loading');

  if (type === 'success') element.classList.add('success');
  if (type === 'error') element.classList.add('error');
  if (type === 'loading') element.classList.add('loading');
}

/* ================= INITIALIZATION ================= */

document.addEventListener('DOMContentLoaded', () => {
  initIntro();
  initReveal();
  initCursor();
  initNavigation();
  initHeroParallax();
  initCairoClock();
  initPlayCards();
  initTheme();
  initWhatsAppModal();
  initContactForm();
});

/* ================= INTRO ================= */

function initIntro() {
  const intro = $('.intro, #intro, .preloader');

  if (!intro) return;

  wait(700).then(() => {
    intro.classList.add('is-hidden');

    setTimeout(() => {
      intro.remove();
    }, 800);
  });
}

/* ================= SCROLL REVEAL ================= */

function initReveal() {
  const elements = $$(
    '[data-reveal], .reveal, .reveal-up, .reveal-left, .reveal-right'
  );

  if (!elements.length) return;

  if (!('IntersectionObserver' in window)) {
    elements.forEach(el => el.classList.add('is-visible', 'visible'));
    return;
  }

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible', 'visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  elements.forEach(el => observer.observe(el));
}

/* ================= CUSTOM CURSOR ================= */

function initCursor() {
  const cursor = $('.custom-cursor, #cursor, .cursor');

  if (!cursor || window.matchMedia('(pointer: coarse)').matches) return;

  document.addEventListener('mousemove', event => {
    cursor.style.left = `${event.clientX}px`;
    cursor.style.top = `${event.clientY}px`;
  });

  $$('a, button, input, textarea, select').forEach(element => {
    element.addEventListener('mouseenter', () => {
      cursor.classList.add('active');
    });

    element.addEventListener('mouseleave', () => {
      cursor.classList.remove('active');
    });
  });
}

/* ================= NAVIGATION ================= */

function initNavigation() {
  const menuButton = $(
    '.menu-toggle, #menu-toggle, .nav-toggle, .hamburger'
  );

  const nav = $('.nav-links, .navbar-menu, #nav-menu, .navigation');

  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('active');
      menuButton.classList.toggle('active', isOpen);
      menuButton.setAttribute('aria-expanded', String(isOpen));
    });

    $$('a', nav).forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('active');
        menuButton.classList.remove('active');
        menuButton.setAttribute('aria-expanded', 'false');
      });
    });
  }

  $$('a[href^="#"]').forEach(link => {
    link.addEventListener('click', event => {
      const targetId = link.getAttribute('href');

      if (!targetId || targetId === '#') return;

      const target = $(targetId);
      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    });
  });

  const sections = $$('section[id]');

  if ('IntersectionObserver' in window && sections.length) {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;

          const id = entry.target.id;

          $$('a[href^="#"]').forEach(link => {
            link.classList.toggle(
              'active',
              link.getAttribute('href') === `#${id}`
            );
          });
        });
      },
      { rootMargin: '-35% 0px -55% 0px' }
    );

    sections.forEach(section => observer.observe(section));
  }
}

/* ================= HERO PARALLAX ================= */

function initHeroParallax() {
  const hero = $('.hero, #hero');

  if (!hero || window.matchMedia('(pointer: coarse)').matches) return;

  const layers = $$('[data-parallax]', hero);

  if (!layers.length) return;

  hero.addEventListener('mousemove', event => {
    const rect = hero.getBoundingClientRect();

    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    layers.forEach(layer => {
      const strength = Number(layer.dataset.parallax) || 10;

      layer.style.transform =
        `translate(${x * strength}px, ${y * strength}px)`;
    });
  });

  hero.addEventListener('mouseleave', () => {
    layers.forEach(layer => {
      layer.style.transform = '';
    });
  });
}

/* ================= CAIRO CLOCK ================= */

function initCairoClock() {
  const clock = $('#cairo-clock, .cairo-clock, [data-cairo-clock]');

  if (!clock) return;

  function updateClock() {
    clock.textContent = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Africa/Cairo',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    }).format(new Date());
  }

  updateClock();
  setInterval(updateClock, 1000);
}

/* ================= PLAY CARDS ================= */

function initPlayCards() {
  $$('[data-play], .play-card, .service-card').forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('active');
    });
  });
}

/* ================= THEME ================= */

function initTheme() {
  const themeButton = $(
    '#theme-toggle, .theme-toggle, [data-theme-toggle]'
  );

  if (!themeButton) return;

  const savedTheme = localStorage.getItem('codex-theme');

  if (savedTheme === 'dark' || savedTheme === 'light') {
    document.documentElement.dataset.theme = savedTheme;
  }

  themeButton.addEventListener('click', () => {
    const currentTheme =
      document.documentElement.dataset.theme || 'light';

    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem('codex-theme', nextTheme);
  });
}

/* ================= WHATSAPP MODAL ================= */

function initWhatsAppModal() {
  const modal = $('#whatsapp-modal, .whatsapp-modal');

  const openButtons = $$(
    '[data-open-whatsapp], #open-whatsapp, .open-whatsapp'
  );

  const closeButtons = $$(
    '[data-close-whatsapp], #close-whatsapp, .close-whatsapp'
  );

  if (!modal) return;

  openButtons.forEach(button => {
    button.addEventListener('click', () => {
      modal.classList.add('active', 'open');
      modal.setAttribute('aria-hidden', 'false');
    });
  });

  closeButtons.forEach(button => {
    button.addEventListener('click', () => {
      modal.classList.remove('active', 'open');
      modal.setAttribute('aria-hidden', 'true');
    });
  });

  modal.addEventListener('click', event => {
    if (event.target === modal) {
      modal.classList.remove('active', 'open');
      modal.setAttribute('aria-hidden', 'true');
    }
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      modal.classList.remove('active', 'open');
      modal.setAttribute('aria-hidden', 'true');
    }
  });
}

/* ================= CONTACT FORM ================= */

function initContactForm() {
  const form = $('#contact-form');

  if (!form) {
    console.warn('CODEX: Contact form not found.');
    return;
  }

  const statusElement = $('#form-status', form.parentElement) ||
    $('#form-status');

  const submitButton = $(
    'button[type="submit"], input[type="submit"]',
    form
  );

  form.addEventListener('submit', async event => {
    event.preventDefault();

    if (form.dataset.submitting === 'true') return;

    const formData = new FormData(form);

    const payload = {
      name: getFormValue(formData, 'name'),
      phone: getFormValue(formData, 'phone'),
      email: getFormValue(formData, 'email'),
      projectType: getFormValue(formData, 'projectType'),
      budget: getFormValue(formData, 'budget'),
      details: getFormValue(formData, 'details')
    };

    const validationError = validateInquiry(payload);

    if (validationError) {
      setStatus(statusElement, validationError, 'error');
      return;
    }

    form.dataset.submitting = 'true';

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.dataset.originalText =
        submitButton.textContent || submitButton.value || '';

      if (submitButton.tagName === 'INPUT') {
        submitButton.value = 'Sending...';
      } else {
        submitButton.textContent = 'Sending...';
      }
    }

    setStatus(statusElement, 'Sending your inquiry...', 'loading');

    try {
      await sendInquiry(payload);

      setStatus(
        statusElement,
        'Thank you! Your inquiry has been submitted.',
        'success'
      );

      form.reset();

    } catch (error) {
      console.error('CODEX inquiry error:', error);

      setStatus(
        statusElement,
        'Unable to submit your inquiry. Please try again or contact us on WhatsApp.',
        'error'
      );

    } finally {
      form.dataset.submitting = 'false';

      if (submitButton) {
        submitButton.disabled = false;

        if (submitButton.tagName === 'INPUT') {
          submitButton.value = submitButton.dataset.originalText;
        } else {
          submitButton.textContent = submitButton.dataset.originalText;
        }
      }
    }
  });
}

function getFormValue(formData, name) {
  const value = formData.get(name);

  if (value === null || typeof value !== 'string') return '';

  return value.trim();
}

function validateInquiry(data) {
  if (!data.name) {
    return 'Please enter your name.';
  }

  if (!data.phone) {
    return 'Please enter your phone number.';
  }

  const phoneDigits = data.phone.replace(/\D/g, '');

  if (phoneDigits.length < 7) {
    return 'Please enter a valid phone number.';
  }

  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return 'Please enter a valid email address.';
  }

  if (!data.projectType) {
    return 'Please select your project type.';
  }

  if (!data.details) {
    return 'Please describe your project.';
  }

  return null;
}

/* ================= GOOGLE APPS SCRIPT REQUEST ================= */

async function sendInquiry(payload) {
  if (!GOOGLE_SCRIPT_URL || !GOOGLE_SCRIPT_URL.endsWith('/exec')) {
    throw new Error('Google Apps Script URL is not configured correctly.');
  }

  const body = new URLSearchParams();

  Object.entries(payload).forEach(([key, value]) => {
    body.append(key, String(value ?? ''));
  });

  /*
    Google Apps Script redirects POST requests.
    no-cors makes the browser response opaque, so it cannot confirm
    whether Google Sheets saved the inquiry.
  */

  const response = await fetch(GOOGLE_SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors',
    body
  });

  /*
    An opaque response does not expose the server's HTTP status or JSON.
    This only confirms that the browser fetch completed without a
    network-level rejection. Verify actual saving in Google Sheets.
  */

  if (response.type !== 'opaque' && !response.ok) {
    throw new Error(`Server returned HTTP ${response.status}`);
  }

  return true;
}

/* ================= WHATSAPP DIRECT LINK ================= */

function openWhatsApp(message = '') {
  if (!WHATSAPP_NUMBER) {
    console.warn('Set WHATSAPP_NUMBER in script.js first.');
    return;
  }

  const url =
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  window.open(url, '_blank', 'noopener,noreferrer');
}

/* ================= GLOBAL ERROR HANDLING ================= */

window.addEventListener('error', event => {
  console.error('CODEX JavaScript error:', event.message);
});

window.addEventListener('unhandledrejection', event => {
  console.error('CODEX async error:', event.reason);
});
