
'use strict';

/* =========================================
   CODEX PORTFOLIO CONFIGURATION
========================================= */

const GOOGLE_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbyXadEXC4Ao1D5bd5dUq8GPbWsP9HneOZjZWUSjnuUj-mrg1c7iZ_WbYpolVGHOH8xlzg/exec';

/* =========================================
   INTRO LOADER
========================================= */

const intro = document.querySelector('.intro');

window.addEventListener('load', () => {
  if (intro) {
    setTimeout(() => intro.classList.add('hide'), 1250);
  }
});

/* =========================================
   SCROLL REVEAL
========================================= */

const revealEls = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => revealObserver.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('visible'));
}

/* =========================================
   POINTER DETECTION
========================================= */

const finePointer = window.matchMedia('(pointer: fine)');

/* =========================================
   CUSTOM CURSOR
========================================= */

const dot = document.querySelector('.cursor-dot');
const ring = document.querySelector('.cursor-ring');

if (finePointer.matches && dot && ring) {
  dot.style.opacity = '1';
  ring.style.opacity = '1';

  let x = 0;
  let y = 0;
  let rx = 0;
  let ry = 0;
  let animationFrame;

  window.addEventListener('mousemove', event => {
    x = event.clientX;
    y = event.clientY;

    dot.style.transform = `translate(${x}px, ${y}px)`;
  });

  function animateRing() {
    rx += (x - rx) * 0.16;
    ry += (y - ry) * 0.16;

    ring.style.left = `${rx}px`;
    ring.style.top = `${ry}px`;

    animationFrame = requestAnimationFrame(animateRing);
  }

  animateRing();

  document.querySelectorAll('a, button').forEach(element => {
    element.addEventListener('mouseenter', () => ring.classList.add('hover'));
    element.addEventListener('mouseleave', () => ring.classList.remove('hover'));
  });

  window.addEventListener('pagehide', () => {
    cancelAnimationFrame(animationFrame);
  });
}

/* =========================================
   MOBILE NAVIGATION
========================================= */

const menuBtn = document.querySelector('.menu-toggle');
const nav = document.querySelector('.topbar nav');

if (menuBtn && nav) {
  menuBtn.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('menu-open');
    menuBtn.setAttribute('aria-expanded', String(isOpen));
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('menu-open');
      menuBtn.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      nav.classList.remove('menu-open');
      menuBtn.setAttribute('aria-expanded', 'false');
    }
  });
}

/* =========================================
   HERO PARALLAX
========================================= */

const hero = document.querySelector('.hero-title-wrap');

if (hero && finePointer.matches) {
  hero.addEventListener('mousemove', event => {
    const rect = hero.getBoundingClientRect();

    if (!rect.width || !rect.height) return;

    const dx = (event.clientX - rect.left - rect.width / 2) / rect.width;
    const dy = (event.clientY - rect.top - rect.height / 2) / rect.height;

    hero.style.transform = `translate(${dx * 7}px, ${dy * 5}px)`;
  });

  hero.addEventListener('mouseleave', () => {
    hero.style.transform = 'translate(0, 0)';
  });
}

/* =========================================
   CAIRO CLOCK
========================================= */

const clockEl = document.getElementById('local-time');

function updateCairoClock() {
  if (!clockEl) return;

  try {
    clockEl.textContent = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Africa/Cairo',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(new Date());
  } catch (error) {
    clockEl.textContent = '--:--';
  }
}

updateCairoClock();

const clockInterval = setInterval(updateCairoClock, 30000);

window.addEventListener('pagehide', () => {
  clearInterval(clockInterval);
});

/* =========================================
   PLAY CARD INTERACTION
========================================= */

const playCard = document.getElementById('play-card');

if (playCard && finePointer.matches) {
  const orb = playCard.querySelector('.play-card-orb');

  playCard.addEventListener('mousemove', event => {
    const rect = playCard.getBoundingClientRect();

    if (!rect.width || !rect.height) return;

    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;

    playCard.style.transform =
      `perspective(900px) rotateY(${px * 8}deg) rotateX(${-py * 7}deg)`;

    if (orb) {
      orb.style.transform =
        `translate(${px * 24}px, ${py * 20}px) scale(1.05)`;
    }
  });

  playCard.addEventListener('mouseleave', () => {
    playCard.style.transform = '';

    if (orb) orb.style.transform = '';
  });
}

/* =========================================
   THEME SWITCH
========================================= */

const themeToggle = document.getElementById('theme-toggle');
const THEME_KEY = 'codex-portfolio-theme';

function applyTheme(theme) {
  const isDark = theme === 'dark';

  document.body.classList.toggle('body-dark', isDark);

  if (themeToggle) {
    themeToggle.textContent = isDark
      ? 'SWITCH THEME ◑'
      : 'SWITCH THEME ◐';

    themeToggle.setAttribute('aria-pressed', String(isDark));
  }
}

let savedTheme = 'light';

try {
  savedTheme = localStorage.getItem(THEME_KEY) || 'light';
} catch (error) {
  savedTheme = 'light';
}

applyTheme(savedTheme);

themeToggle?.addEventListener('click', () => {
  const isDark = document.body.classList.toggle('body-dark');
  const newTheme = isDark ? 'dark' : 'light';

  try {
    localStorage.setItem(THEME_KEY, newTheme);
  } catch (error) {
    // Theme remains active for the current page.
  }

  applyTheme(newTheme);
});

/* =========================================
   WHATSAPP DIALOG
========================================= */

const whatsappDialog = document.getElementById('whatsapp-modal');

document.querySelectorAll('[data-open-whatsapp]').forEach(trigger => {
  trigger.addEventListener('click', () => {
    if (!whatsappDialog) return;

    if (typeof whatsappDialog.showModal === 'function') {
      if (!whatsappDialog.open) whatsappDialog.showModal();
    }
  });
});

document.querySelectorAll('[data-close-whatsapp]').forEach(trigger => {
  trigger.addEventListener('click', () => {
    whatsappDialog?.close();
  });
});

whatsappDialog?.addEventListener('click', event => {
  if (event.target === whatsappDialog) {
    whatsappDialog.close();
  }
});

/* =========================================
   CONTACT FORM
========================================= */

const inquiryForm = document.getElementById('contact-form');
const inquiryStatus = document.getElementById('form-status');

function setFormStatus(message, state) {
  if (!inquiryStatus) return;

  inquiryStatus.textContent = message;
  inquiryStatus.dataset.state = state;
}

function normalizePhone(value) {
  return String(value || '').replace(/\D/g, '');
}

if (inquiryForm) {
  const phoneField = inquiryForm.elements.namedItem('phone');

  phoneField?.addEventListener('input', () => {
    phoneField.setCustomValidity('');
  });

  inquiryForm.addEventListener('submit', async event => {
    event.preventDefault();

    if (!inquiryForm.reportValidity()) return;

    const phoneDigits = normalizePhone(phoneField?.value);

    if (phoneDigits.length < 8 || phoneDigits.length > 15) {
      phoneField?.setCustomValidity('Please enter a valid phone number.');
      phoneField?.reportValidity();
      return;
    }

    if (
      !GOOGLE_SCRIPT_URL.startsWith(
        'https://script.google.com/macros/s/'
      ) ||
      GOOGLE_SCRIPT_URL.includes('PASTE_')
    ) {
      setFormStatus(
        'Contact form connection is not configured.',
        'error'
      );
      return;
    }

    const submitButton = inquiryForm.querySelector('[type="submit"]');

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.setAttribute('aria-busy', 'true');
    }

    setFormStatus('Sending your inquiry...', 'loading');

    try {
      const payload = Object.fromEntries(
        new FormData(inquiryForm).entries()
      );

      /*
       * Google Apps Script web apps commonly require no-cors
       * for this cross-origin form submission.
       *
       * An opaque response cannot confirm successful delivery.
       */

      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: new URLSearchParams(payload)
      });

      setFormStatus(
        'Your request has been sent. Thank you for contacting CODEX!',
        'success'
      );

      inquiryForm.reset();

    } catch (error) {
      console.error('Inquiry submission error:', error);

      setFormStatus(
        'Could not send your inquiry. Please contact us through WhatsApp.',
        'error'
      );

    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.removeAttribute('aria-busy');
      }
    }
  });
}

/* =========================================
   ACCESSIBILITY: REDUCED MOTION
========================================= */

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (reducedMotion.matches) {
  document.querySelectorAll('.reveal').forEach(element => {
    element.classList.add('visible');
  });
}

console.info('CODEX Portfolio initialized successfully.');
