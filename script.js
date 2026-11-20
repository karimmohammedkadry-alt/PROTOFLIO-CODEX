const intro = document.querySelector('.intro');
window.addEventListener('load', () => setTimeout(() => intro?.classList.add('hide'), 1250));

// Reveal sections as they enter the viewport.
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => revealObserver.observe(el));

// Small custom cursor on fine-pointer devices only.
const dot = document.querySelector('.cursor-dot');
const ring = document.querySelector('.cursor-ring');
const finePointer = window.matchMedia('(pointer:fine)');
if (finePointer.matches && dot && ring) {
  dot.style.opacity = ring.style.opacity = '1';
  let x = 0, y = 0, rx = 0, ry = 0;
  window.addEventListener('mousemove', e => { x = e.clientX; y = e.clientY; dot.style.transform = `translate(${x}px,${y}px)`; });
  const animateRing = () => { rx += (x-rx)*.16; ry += (y-ry)*.16; ring.style.left = `${rx}px`; ring.style.top = `${ry}px`; requestAnimationFrame(animateRing); };
  animateRing();
  document.querySelectorAll('a,button').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
  });
}
// Mobile menu toggle.
const menuBtn = document.querySelector('.menu-toggle');
const nav = document.querySelector('.topbar nav');
menuBtn?.addEventListener('click', () => {
  const open = nav.classList.toggle('menu-open');
  menuBtn.setAttribute('aria-expanded', String(open));
});
nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('menu-open')));
// Subtle hero parallax on pointer move (desktop).
const hero = document.querySelector('.hero-title-wrap');
if (hero && finePointer.matches) {
  hero.addEventListener('mousemove', e => {
    const rect = hero.getBoundingClientRect();
    const dx = (e.clientX - rect.left - rect.width/2) / rect.width;
    const dy = (e.clientY - rect.top - rect.height/2) / rect.height;
    hero.style.transform = `translate(${dx*7}px, ${dy*5}px)`;
  });
  hero.addEventListener('mouseleave', () => hero.style.transform = 'translate(0,0)');
}
// Live Cairo clock
const clockEl = document.getElementById('local-time');
function updateCairoClock(){ if(clockEl){ clockEl.textContent = new Intl.DateTimeFormat('en-GB',{timeZone:'Africa/Cairo',hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date()); } }
updateCairoClock(); setInterval(updateCairoClock, 30000);
// Pointer-driven card tilt (desktop only)
const playCard = document.getElementById('play-card');
if(playCard && finePointer.matches){
  playCard.addEventListener('mousemove',e=>{const r=playCard.getBoundingClientRect();const px=(e.clientX-r.left)/r.width-.5;const py=(e.clientY-r.top)/r.height-.5;playCard.style.transform=`perspective(900px) rotateY(${px*8}deg) rotateX(${-py*7}deg)`;const orb=playCard.querySelector('.play-card-orb');if(orb)orb.style.transform=`translate(${px*24}px,${py*20}px) scale(1.05)`;});
  playCard.addEventListener('mouseleave',()=>{playCard.style.transform='';const orb=playCard.querySelector('.play-card-orb');if(orb)orb.style.transform='';});
}
// Theme switch
const themeToggle=document.getElementById('theme-toggle');
themeToggle?.addEventListener('click',()=>{document.body.classList.toggle('body-dark');themeToggle.textContent=document.body.classList.contains('body-dark')?'SWITCH THEME ◑':'SWITCH THEME ◐';});

// WhatsApp number chooser: opens a native, accessible dialog with both numbers.
const whatsappDialog = document.getElementById('whatsapp-modal');
document.querySelectorAll('[data-open-whatsapp]').forEach(trigger => {
  trigger.addEventListener('click', () => {
    if (whatsappDialog?.showModal) whatsappDialog.showModal();
  });
});
document.querySelectorAll('[data-close-whatsapp]').forEach(trigger => {
  trigger.addEventListener('click', () => whatsappDialog?.close());
});
whatsappDialog?.addEventListener('click', event => {
  if (event.target === whatsappDialog) whatsappDialog.close();
});
// Google Apps Script form endpoint. Add your deployed URL to enable submissions.
const GOOGLE_SCRIPT_URL = 'PASTE_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE';
const inquiryForm = document.getElementById('contact-form');
const inquiryStatus = document.getElementById('form-status');
inquiryForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!inquiryForm.reportValidity()) return;
  const phoneField = inquiryForm.elements.phone;
  const phoneDigits = (phoneField?.value || '').replace(/\D/g, '');
  if (phoneDigits.length < 8 || phoneDigits.length > 15) {
    phoneField.setCustomValidity('Please enter a valid phone number.');
    phoneField.reportValidity();
    phoneField.addEventListener('input', () => phoneField.setCustomValidity(''), { once: true });
    return;
  }
  if (!GOOGLE_SCRIPT_URL.startsWith('https://script.google.com/macros/s/')) {
    inquiryStatus.dataset.state = 'error';
    inquiryStatus.textContent = 'Form layout is ready. Connect the Google Apps Script URL in script.js to receive messages.';
    return;
  }
  const submit = inquiryForm.querySelector('[type="submit"]');
  if (submit) { submit.disabled = true; submit.setAttribute('aria-busy','true'); }
  inquiryStatus.textContent = 'Sending your inquiry…';
  try {
    const payload = Object.fromEntries(new FormData(inquiryForm).entries());
    await fetch(GOOGLE_SCRIPT_URL, {method:'POST', mode:'no-cors', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload)});
    inquiryStatus.dataset.state = 'success';
    inquiryStatus.textContent = 'Thanks! Your inquiry was submitted. If delivery is configured correctly, Karim will receive it.';
    inquiryForm.reset();
  } catch (err) {
    inquiryStatus.dataset.state = 'error';
    inquiryStatus.textContent = 'Could not submit right now. Please contact via WhatsApp instead.';
  } finally { if (submit) { submit.disabled = false; submit.removeAttribute('aria-busy'); } }
});
https://script.google.com/macros/s/AKfycbyXadEXC4Ao1D5bd5dUq8GPbWsP9HneOZjZWUSjnuUj-mrg1c7iZ_WbYpolVGHOH8xlzg/exec