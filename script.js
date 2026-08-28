/* ════════════════════════════════════════════════════════════════════
   BRISTI & SASWATI — script.js
   Minimal JS: year stamp + entrance animations + tile ripple effect.
   No libraries required. Pure vanilla.
   ════════════════════════════════════════════════════════════════════ */

/* ── 1. AUTO YEAR IN FOOTER ── */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();


/* ── 2. ENTRANCE ANIMATION ──
   Elements fade + slide up gently on load.
   Uses IntersectionObserver so it works for dynamically added tiles too.
*/

// CSS for the animation is injected here so it lives alongside its JS logic
const entranceStyle = document.createElement('style');
entranceStyle.textContent = `
  .js-reveal {
    opacity: 0;
    transform: translateY(22px);
    transition: opacity 540ms cubic-bezier(0.22, 1, 0.36, 1),
                transform 540ms cubic-bezier(0.22, 1, 0.36, 1);
  }
  .js-reveal.is-visible {
    opacity: 1;
    transform: translateY(0);
  }
  @media (prefers-reduced-motion: reduce) {
    .js-reveal { opacity: 1; transform: none; transition: none; }
  }
`;
document.head.appendChild(entranceStyle);

// Mark elements we want to animate
const revealTargets = document.querySelectorAll(
  '.brand-header, .link-tile, .site-footer'
);

revealTargets.forEach((el, i) => {
  el.classList.add('js-reveal');
  // Stagger delay per element
  el.style.transitionDelay = `${i * 80}ms`;
});

// Observe them
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target); // animate once only
      }
    });
  },
  { threshold: 0.12 }
);

revealTargets.forEach((el) => revealObserver.observe(el));


/* ── 3. TILE RIPPLE EFFECT ON CLICK ──
   Adds a soft radial ripple from the tap point — feels tactile.
*/
document.querySelectorAll('.link-tile').forEach((tile) => {

  tile.addEventListener('click', function (e) {
    // Remove any existing ripple so clicks in quick succession work
    const old = this.querySelector('.tile-ripple');
    if (old) old.remove();

    const rect = this.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size   = Math.max(rect.width, rect.height) * 2;
    const x      = e.clientX - rect.left - size / 2;
    const y      = e.clientY - rect.top  - size / 2;

    ripple.className = 'tile-ripple';
    Object.assign(ripple.style, {
      position:       'absolute',
      width:          size + 'px',
      height:         size + 'px',
      left:           x + 'px',
      top:            y + 'px',
      borderRadius:   '50%',
      background:     'currentColor',
      opacity:        '0.08',
      pointerEvents:  'none',
      transform:      'scale(0)',
      animation:      'rippleOut 500ms ease-out forwards',
    });

    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 520);
  });
});

// Inject the ripple keyframe
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
  @keyframes rippleOut {
    to { transform: scale(1); opacity: 0; }
  }
`;
document.head.appendChild(rippleStyle);
