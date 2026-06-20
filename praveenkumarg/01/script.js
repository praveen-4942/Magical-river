/* =============================================
   ARTISTE PORTFOLIO — script.js
   ============================================= */

'use strict';

/* ─── CURSOR ──────────────────────────────── */
const cursor      = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursorTrail');
let   mouseX = 0, mouseY = 0;
let   trailX = 0, trailY = 0;

if (cursor && cursorTrail) {
  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  // Smooth-trailing second circle
  function animateTrail() {
    trailX += (mouseX - trailX) * 0.12;
    trailY += (mouseY - trailY) * 0.12;
    cursorTrail.style.left = trailX + 'px';
    cursorTrail.style.top  = trailY + 'px';
    requestAnimationFrame(animateTrail);
  }
  animateTrail();

  // Hover state on interactive elements
  const hoverEls = document.querySelectorAll('a, button, .gallery-card, .craft-card, .store-card, .insta-cell, .filter-btn, .skill-pill');
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    cursorTrail.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    cursorTrail.style.opacity = '1';
  });
}

/* ─── NAV SCROLL EFFECT ───────────────────── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
}, { passive: true });

/* ─── HAMBURGER MENU ──────────────────────── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Close on link click
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!nav.contains(e.target)) {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    }
  });
}

/* ─── SCROLL REVEAL ───────────────────────── */
const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Stagger children with --delay if present
      const delay = getComputedStyle(entry.target).getPropertyValue('--delay');
      if (delay && delay.trim()) {
        entry.target.style.transitionDelay = delay.trim();
      }
      entry.target.classList.add('in');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

// Trigger hero elements on load
window.addEventListener('load', () => {
  document.querySelectorAll('.hero .reveal-up').forEach(el => {
    setTimeout(() => el.classList.add('in'), 100);
  });
});

/* ─── GALLERY FILTER ──────────────────────── */
const filterBtns  = document.querySelectorAll('.filter-btn');
const galleryCards = document.querySelectorAll('.gallery-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;

    galleryCards.forEach(card => {
      if (filter === 'all' || card.dataset.category === filter) {
        card.classList.remove('hidden');
        // Re-trigger reveal if needed
        requestAnimationFrame(() => {
          card.style.opacity = '1';
          card.style.transform = 'none';
        });
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

/* ─── LIGHTBOX ────────────────────────────── */
const lightbox        = document.getElementById('lightbox');
const lightboxContent = document.getElementById('lightboxContent');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose   = document.getElementById('lightboxClose');

function openLightbox(contentNode, caption) {
  lightboxContent.innerHTML = '';
  lightboxContent.appendChild(contentNode);
  lightboxCaption.textContent = caption;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

const galleryImageWrappers = document.querySelectorAll('.gallery-img-wrap');

galleryImageWrappers.forEach(wrap => {
  wrap.addEventListener('click', () => {
    const img = wrap.querySelector('img');
    if (!img) return;

    const title = wrap.closest('.gallery-card')?.querySelector('.gallery-title')?.textContent || img.alt || 'Artwork';
    const clone = img.cloneNode(true);
    clone.style.maxWidth  = '90vw';
    clone.style.maxHeight = '80vh';
    clone.style.width     = 'auto';
    clone.style.height    = 'auto';
    clone.style.display   = 'block';

    openLightbox(clone, title);
  });
});

if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
if (lightbox) {
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });
}
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
});

/* ─── CONTACT FORM ────────────────────────── */
const contactForm = document.getElementById('contactForm');
const formSuccess  = document.getElementById('formSuccess');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    try {
      const formData = new FormData(contactForm);
      const res = await fetch(contactForm.action, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: formData
      });

      if (res.ok) {
        formSuccess.style.display = 'block';
        contactForm.reset();
      } else {
        alert('Something went wrong. Please try emailing directly instead.');
      }
    } catch (err) {
      alert('Network error — please try again or email directly.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message';
    }
  });
}

/* ─── SMOOTH ACTIVE NAV LINK ──────────────── */
const sections = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav-link:not(.nav-link--cta)');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinkEls.forEach(link => {
        link.style.color = link.getAttribute('href') === `#${id}`
          ? 'var(--gold)'
          : '';
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

/* ─── STORE BUTTON RIPPLE ─────────────────── */
document.querySelectorAll('.store-btn').forEach(btn => {
  btn.addEventListener('click', function (e) {
    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position:absolute;
      width:60px;height:60px;
      background:rgba(255,255,255,0.3);
      border-radius:50%;
      transform:scale(0);
      pointer-events:none;
      animation:ripple 0.6s ease-out forwards;
      left:${e.offsetX - 30}px;
      top:${e.offsetY - 30}px;
    `;
    this.style.position = 'relative';
    this.style.overflow = 'hidden';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
  });
});

// Add ripple keyframes dynamically
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
  @keyframes ripple {
    to { transform: scale(4); opacity: 0; }
  }
`;
document.head.appendChild(rippleStyle);

/* ─── PARALLAX HERO ───────────────────────── */
const heroFrame = document.querySelector('.hero-frame');
if (heroFrame && window.innerWidth > 768) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    heroFrame.style.transform = `translateY(${y * 0.15}px)`;
  }, { passive: true });
}

/* ─── ORB MOUSE REACT ─────────────────────── */
const orbs = document.querySelectorAll('.orb');
document.addEventListener('mousemove', e => {
  const xPct = (e.clientX / window.innerWidth  - 0.5) * 2;
  const yPct = (e.clientY / window.innerHeight - 0.5) * 2;
  orbs.forEach((orb, i) => {
    const factor = (i + 1) * 12;
    orb.style.transform = `translate(${xPct * factor}px, ${yPct * factor}px) scale(1)`;
  });
}, { passive: true });

/* ─── INSTA CELL COLOUR PULSE ─────────────── */
document.querySelectorAll('.insta-cell:not(.insta-cell--cta)').forEach(cell => {
  const hue = cell.style.getPropertyValue('--hue') || '0';
  cell.style.background = `hsl(${hue}, 18%, 11%)`;
  // Random subtle pattern
  const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
  svg.setAttribute('viewBox','0 0 100 100');
  svg.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;opacity:0.18;';
  const h = parseInt(hue);
  // alternating cross-hatch or circles per cell
  if (h % 3 === 0) {
    for (let i = 0; i <= 100; i += 12) {
      const l = document.createElementNS('http://www.w3.org/2000/svg','line');
      l.setAttribute('x1', i); l.setAttribute('y1', '0');
      l.setAttribute('x2', i); l.setAttribute('y2', '100');
      l.setAttribute('stroke', `hsl(${h},50%,65%)`);
      l.setAttribute('stroke-width', '0.5');
      svg.appendChild(l);
    }
  } else if (h % 3 === 1) {
    for (let r = 10; r <= 70; r += 18) {
      const c = document.createElementNS('http://www.w3.org/2000/svg','circle');
      c.setAttribute('cx','50'); c.setAttribute('cy','50');
      c.setAttribute('r', r);
      c.setAttribute('fill','none');
      c.setAttribute('stroke', `hsl(${h},50%,65%)`);
      c.setAttribute('stroke-width','0.5');
      svg.appendChild(c);
    }
  } else {
    for (let i = 0; i <= 100; i += 14) {
      const l = document.createElementNS('http://www.w3.org/2000/svg','line');
      l.setAttribute('x1','0'); l.setAttribute('y1', i);
      l.setAttribute('x2','100'); l.setAttribute('y2', i);
      l.setAttribute('stroke', `hsl(${h},50%,65%)`);
      l.setAttribute('stroke-width','0.5');
      svg.appendChild(l);
    }
  }
  cell.style.position = 'relative';
  cell.insertBefore(svg, cell.firstChild);
});

/* ─── HERO TITLE CHAR ANIMATION ──────────── */
window.addEventListener('DOMContentLoaded', () => {
  const titleLines = document.querySelectorAll('.hero-title-line');
  titleLines.forEach((line, i) => {
    line.style.transitionDelay = `${0.25 + i * 0.15}s`;
    line.style.opacity = '0';
    line.style.transform = 'translateY(20px)';
    line.style.transition = 'opacity 0.7s cubic-bezier(0.22,1,0.36,1), transform 0.7s cubic-bezier(0.22,1,0.36,1)';
    setTimeout(() => {
      line.style.opacity = '1';
      line.style.transform = 'none';
    }, 300 + i * 150);
  });
});

/* ─── SECTION TAG COUNTER ANIMATION ──────── */
function animateCounter(el, target, suffix = '') {
  let current = 0;
  const step = Math.ceil(target / 40);
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = current + suffix;
    if (current >= target) clearInterval(timer);
  }, 30);
}

const statNums = document.querySelectorAll('.stat-num');
const statObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const raw = el.textContent;
      const match = raw.match(/(\d+)(.*)/);
      if (match) {
        animateCounter(el, parseInt(match[1]), match[2]);
      }
      statObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

statNums.forEach(el => statObserver.observe(el));

