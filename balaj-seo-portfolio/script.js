gsap.registerPlugin(ScrollTrigger);

/* =====================================================================
   BOOK-OPEN REVEAL
   A single reusable animation used everywhere on the site. Every element
   starts folded shut like a book page/cover along one edge (its "spine"),
   then swings open flat as it scrolls into view — a soft shadow sweeps
   across it while it opens, just like light hitting a page as it lifts.
   Everything on the page is now driven by ScrollTrigger only.
   ===================================================================== */
function bookReveal(selector, opts = {}) {
  const els = gsap.utils.toArray(selector);
  if (!els.length) return;

  const {
    edge = 'left',       // 'left' | 'right' | 'top' | 'bottom' -> which side is the spine
    angle = 100,         // how far shut the page starts, in degrees
    duration = 1.15,
    stagger = 0,
    start = 'top 85%',
    trigger = null,      // optional shared trigger (e.g. a parent grid) instead of each el
    perspective = 1500,
    delay = 0
  } = opts;

  const axis = (edge === 'left' || edge === 'right') ? 'rotateY' : 'rotateX';
  const sign = (edge === 'left' || edge === 'top') ? -1 : 1;
  const origin = edge === 'left' ? 'left center'
              : edge === 'right' ? 'right center'
              : edge === 'top' ? 'center top'
              : 'center bottom';

  els.forEach((el, i) => {
    el.classList.add('book-page');
    gsap.set(el, { transformPerspective: perspective, transformOrigin: origin });

    // spine shade — a soft gradient that sweeps off the page as it opens
    const shade = document.createElement('span');
    shade.className = 'book-page__shade';
    shade.style.setProperty('--shade-dir', (edge === 'left') ? 'to right' : (edge === 'right') ? 'to left' : (edge === 'top') ? 'to bottom' : 'to top');
    el.appendChild(shade);

    const from = { opacity: 0, [axis]: sign * angle };
    const to = { opacity: 1, [axis]: 0, duration, ease: 'power3.out', delay: delay + i * stagger };

    if (trigger) {
      to.scrollTrigger = { trigger, start };
    } else {
      to.scrollTrigger = { trigger: el, start };
    }
    gsap.fromTo(el, from, to);

    gsap.fromTo(shade, { opacity: 0.5 }, {
      opacity: 0, duration: duration * 0.85, ease: 'power2.out', delay: delay + i * stagger,
      scrollTrigger: { trigger: trigger || el, start }
    });
  });
}

/* ===================== PROFILE PANEL TOGGLE ===================== */
const seoChip = document.getElementById('seoChip');
const profilePanel = document.getElementById('profilePanel');
const profileClose = document.getElementById('profileClose');

function openProfilePanel(){
  profilePanel.classList.add('is-open');
  seoChip.setAttribute('aria-expanded', 'true');
}
function closeProfilePanel(){
  profilePanel.classList.remove('is-open');
  seoChip.setAttribute('aria-expanded', 'false');
}
if (seoChip && profilePanel) {
  seoChip.addEventListener('click', () => {
    const isOpen = profilePanel.classList.contains('is-open');
    isOpen ? closeProfilePanel() : openProfilePanel();
  });
  seoChip.addEventListener('mouseenter', openProfilePanel);
  profilePanel.addEventListener('mouseleave', () => {
    if (!seoChip.matches(':hover')) closeProfilePanel();
  });
  seoChip.addEventListener('mouseleave', () => {
    setTimeout(() => {
      if (!profilePanel.matches(':hover') && !seoChip.matches(':hover')) closeProfilePanel();
    }, 80);
  });
  profileClose.addEventListener('click', closeProfilePanel);
  document.addEventListener('click', (e) => {
    if (!profilePanel.contains(e.target) && e.target !== seoChip && profilePanel.classList.contains('is-open')) {
      closeProfilePanel();
    }
  });
  profilePanel.querySelectorAll('[data-nav]').forEach(link => {
    link.addEventListener('click', closeProfilePanel);
  });
}

/* ===================== NAV ===================== */
const nav = document.getElementById('nav');
ScrollTrigger.create({
  start: 'top -80',
  end: 99999,
  toggleClass: { targets: nav, className: 'is-scrolled' }
});

const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
burger.addEventListener('click', () => {
  mobileMenu.classList.toggle('is-open');
});
document.querySelectorAll('.mobile-menu [data-nav], .mobile-menu .btn').forEach(el=>{
  el.addEventListener('click', () => mobileMenu.classList.remove('is-open'));
});

/* active link highlight */
const navLinks = document.querySelectorAll('[data-nav]');
const sections = ['about','services','projects','contact','blog','book'].map(id=>document.getElementById(id)).filter(Boolean);
sections.forEach(sec=>{
  ScrollTrigger.create({
    trigger: sec,
    start: 'top center',
    end: 'bottom center',
    onToggle: self => {
      if(self.isActive){
        navLinks.forEach(l=>l.classList.remove('active'));
        document.querySelectorAll(`[data-nav][href="#${sec.id}"]`).forEach(l=>l.classList.add('active'));
      }
    }
  });
});

/* ===================== HERO — opens like a book cover ===================== */
bookReveal('.hero__inner', { edge: 'left', angle: 85, duration: 1.4, start: 'top 100%' });

gsap.fromTo('.hero__scroll', { opacity: 0, y: 14 }, {
  opacity: 1, y: 0, duration: 0.7, delay: 0.6,
  scrollTrigger: { trigger: '.hero', start: 'top 100%' }
});
gsap.fromTo('.hero__scroll-line', { height: 0 }, {
  height: 90, duration: 1.2, delay: 0.4, ease: 'power2.out',
  scrollTrigger: { trigger: '.hero', start: 'top 100%' }
});

/* =====================================================================
   Every heading, card, panel and block below now uses the SAME
   book-open animation — only the spine side/angle changes so it always
   reads as a page or cover swinging into place while you scroll.
   ===================================================================== */

/* headings */
bookReveal('[data-split]', { edge: 'top', angle: 55, duration: 1 });

/* section eyebrows (✳ label) */
gsap.utils.toArray('.section-eyebrow').forEach(eyebrow=>{
  const asterisk = eyebrow.querySelector('.asterisk');
  bookReveal(eyebrow, { edge: 'left', angle: 70, duration: 0.8 });
  if (asterisk){
    gsap.fromTo(asterisk, { rotate: -90, scale: 0 }, {
      rotate: 0, scale: 1, duration: 0.7, ease: 'back.out(3)',
      scrollTrigger: { trigger: eyebrow, start: 'top 92%' }
    });
  }
});

bookReveal('.section-head__desc', { edge: 'right', angle: 60, duration: 1 });

/* ===================== CLIENTS MARQUEE ===================== */
const track = document.getElementById('marqueeTrack');
track.innerHTML += track.innerHTML; // duplicate for seamless loop
let marqueeTween = gsap.to(track, {
  xPercent: -50,
  duration: 26,
  ease: 'none',
  repeat: -1
});

let marqueeHover = false;
track.addEventListener('mouseenter', () => { marqueeHover = true; marqueeTween.timeScale(0.25); });
track.addEventListener('mouseleave', () => { marqueeHover = false; marqueeTween.timeScale(1); });

bookReveal('.marquee', { edge: 'left', angle: 80, duration: 1.1, start: 'top 85%' });

/* ===================== PROJECTS CAROUSEL ===================== */
const projectsTrack = document.getElementById('projectsTrack');
if (projectsTrack) {
  projectsTrack.innerHTML += projectsTrack.innerHTML; // duplicate for seamless loop
  let projectsTween = gsap.to(projectsTrack, {
    xPercent: -50,
    duration: 46,
    ease: 'none',
    repeat: -1
  });

  let projectsHover = false;
  projectsTrack.addEventListener('mouseenter', () => { projectsHover = true; projectsTween.timeScale(0.25); });
  projectsTrack.addEventListener('mouseleave', () => { projectsHover = false; projectsTween.timeScale(1); });

  ScrollTrigger.create({
    trigger: document.body,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: self => {
      if (projectsHover) return;
      const vel = self.getVelocity();
      const factor = gsap.utils.clamp(0.5, 2, 1 + Math.abs(vel) / 4000);
      gsap.to(projectsTween, { timeScale: factor, duration: 0.4, overwrite: true });
    }
  });
}

/* marquee playfully speeds up on fast scroll, eases back to normal */
ScrollTrigger.create({
  trigger: document.body,
  start: 'top top',
  end: 'bottom bottom',
  onUpdate: self => {
    if (marqueeHover) return;
    const vel = self.getVelocity();
    const factor = gsap.utils.clamp(0.6, 2.4, 1 + Math.abs(vel) / 3000);
    gsap.to(marqueeTween, { timeScale: factor, duration: 0.4, overwrite: true });
  }
});

/* ===================== PROJECTS — each card opens like a page ===================== */
bookReveal('.project-card', { edge: 'left', angle: 100, duration: 1.1, stagger: 0.18 });

/* ===================== PROJECT CASE STUDIES ===================== */
/* NOTE: har case study ka title/client/challenge/metrics/work/image ab
   index.html me "#caseStudySource" ke andar HTML ki shakal me hai.
   Yahan sirf wahan se data read karke popup me dikhaya ja raha hai. */
const caseStudy = document.getElementById('caseStudy');
function openCaseStudy(key) {
  const source = document.querySelector(`#caseStudySource .cs-item[data-key="${key}"]`)
    || document.querySelector('#caseStudySource .cs-item[data-key="dawlance"]');
  if (!source) return;

  document.getElementById('caseStudyTitle').textContent = source.querySelector('.cs-title').textContent.trim();
  document.getElementById('caseStudyChallenge').textContent = source.querySelector('.cs-challenge').textContent.trim();
  document.getElementById('caseStudyClient').textContent = source.querySelector('.cs-client').textContent.trim();
  document.getElementById('caseStudyDuration').textContent = source.querySelector('.cs-duration').textContent.trim();

  document.getElementById('caseStudyMetrics').innerHTML = Array.from(source.querySelectorAll('.cs-metric')).map(m => {
    const value = m.querySelector('.cs-value').textContent.trim();
    const label = m.querySelector('.cs-label').textContent.trim();
    return `<div class="case-study__metric"><strong>${value}</strong><span>${label}</span></div>`;
  }).join('');

  document.getElementById('caseStudyWork').innerHTML = Array.from(source.querySelectorAll('.cs-work-item')).map(w => {
    const name = w.querySelector('.cs-work-name').textContent.trim();
    const text = w.querySelector('.cs-work-text').textContent.trim();
    return `<div class="case-study__work-row"><strong>✓ &nbsp;${name}</strong><span>${text}</span></div>`;
  }).join('');

  const imageEl = source.querySelector('.cs-image');
  const chartImg = document.getElementById('caseStudyChartImage');
  if (chartImg && imageEl && imageEl.dataset.src) {
    chartImg.src = imageEl.dataset.src;
    chartImg.alt = source.querySelector('.cs-client').textContent.trim() + ' performance snapshot';
  }

  document.getElementById('caseStudyLive').href = '#contact';
  caseStudy.hidden = false;
  document.body.classList.add('case-study-open');
  caseStudy.querySelector('.case-study__close').focus();
}
function closeCaseStudy() {
  caseStudy.hidden = true;
  document.body.classList.remove('case-study-open');
}
document.querySelectorAll('.project-card[data-project]').forEach(card => {
  card.addEventListener('click', () => openCaseStudy(card.dataset.project));
  card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openCaseStudy(card.dataset.project); } });
});
caseStudy.querySelectorAll('[data-case-close]').forEach(el => el.addEventListener('click', closeCaseStudy));
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !caseStudy.hidden) closeCaseStudy(); });

/* ===================== RESULTS / STATS ===================== */
bookReveal('.stat-card', { edge: 'left', angle: 90, duration: 1, stagger: 0.12 });
gsap.utils.toArray('.stat-card').forEach((card) => {
  const num = card.querySelector('.stat-card__num');
  ScrollTrigger.create({
    trigger: card, start: 'top 88%', once: true,
    onEnter: () => {
      const target = parseFloat(num.dataset.count);
      const prefix = num.dataset.prefix || '';
      const counter = { val: 0 };
      gsap.to(counter, {
        val: target, duration: 1.3, delay: 0.3, ease: 'power2.out',
        onUpdate: () => { num.textContent = prefix + Math.round(counter.val); }
      });
    }
  });
});

/* ===================== SERVICES ===================== */
gsap.utils.toArray('.service-panel').forEach(panel => {
  bookReveal(panel, { edge: 'left', angle: 60, duration: 1.1 });

  const pills = panel.querySelectorAll('.pill');
  gsap.set(pills, { transformPerspective: 600, transformOrigin: 'center top' });
  gsap.fromTo(pills,
    {
      y: () => gsap.utils.random(-180, -130),
      x: () => gsap.utils.random(-18, 18),
      opacity: 0,
      rotate: () => gsap.utils.random(-22, 22)
    },
    {
      y: 0,
      x: 0,
      opacity: 1,
      rotate: 0,
      duration: 1.3,
      ease: 'bounce.out',
      stagger: { each: 0.07, from: 'random' },
      scrollTrigger: { trigger: panel, start: 'top 80%' }
    }
  );
});

/* ===================== PILL HOVER — MAGNETIC FOLLOW + TILT ===================== */
/* Box shifts left/right to follow the pointer, but never leaves its own row */
document.querySelectorAll('.pill-row').forEach(row => {
  row.querySelectorAll('.pill').forEach(pill => {
    pill.addEventListener('mousemove', (e) => {
      const rect = pill.getBoundingClientRect();
      const rowRect = row.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 (left) .. 0.5 (right)
      const relY = (e.clientY - rect.top) / rect.height - 0.5;

      // desired horizontal follow distance
      let shiftX = relX * 34;

      // clamp so the pill's edges never cross its row's edges
      const minShift = rowRect.left - rect.left;
      const maxShift = rowRect.right - rect.right;
      shiftX = gsap.utils.clamp(minShift, maxShift, shiftX);

      gsap.to(pill, {
        x: shiftX,
        rotateX: relY * -28,
        rotateY: relX * 28,
        scale: 1.1,
        y: -4,
        duration: 0.3,
        ease: 'power2.out',
        overwrite: true
      });
    });
    pill.addEventListener('mouseleave', () => {
      gsap.to(pill, {
        x: 0,
        rotateX: 0,
        rotateY: 0,
        scale: 1,
        y: 0,
        duration: 0.8,
        ease: 'elastic.out(1, 0.35)',
        overwrite: true
      });
    });
  });
});

bookReveal('.accordion__item', { edge: 'left', angle: 65, duration: 0.85, stagger: 0.09 });

/* ===================== ACCORDION (click toggle) ===================== */
document.querySelectorAll('.accordion__item').forEach(item => {
  const head = item.querySelector('.accordion__head');
  const body = item.querySelector('.accordion__body');
  gsap.set(body, { height: 0 });
  head.addEventListener('click', () => {
    const isOpen = item.classList.contains('is-open');
    document.querySelectorAll('.accordion__item.is-open').forEach(openItem=>{
      if(openItem !== item){
        openItem.classList.remove('is-open');
        gsap.to(openItem.querySelector('.accordion__body'), { height: 0, duration: 0.5, ease: 'power3.inOut' });
      }
    });
    if (isOpen) {
      item.classList.remove('is-open');
      gsap.to(body, { height: 0, duration: 0.5, ease: 'power3.inOut' });
    } else {
      item.classList.add('is-open');
      gsap.set(body, { height: 'auto' });
      const h = body.offsetHeight;
      gsap.fromTo(body, { height: 0 }, { height: h, duration: 0.5, ease: 'power3.inOut' });
    }
  });
});

/* ===================== PROCESS WHEEL ===================== */
const wheel = document.getElementById('wheel');
const nodes = gsap.utils.toArray('.wheel__node');

function positionNodes() {
  const size = wheel.clientWidth;
  const isMobile = window.innerWidth <= 700;
  const isSmall = window.innerWidth <= 420;
  const r = isSmall ? size * 0.34 : (isMobile ? size * 0.33 : size * 0.37);
  const cx = size / 2, cy = size / 2;
  nodes.forEach(node => {
    const angleDeg = parseFloat(node.style.getPropertyValue('--angle'));
    const angle = (angleDeg * Math.PI) / 180;
    const x = cx + r * Math.cos(angle) - node.offsetWidth / 2;
    const y = cy + r * Math.sin(angle) - node.offsetHeight / 2;
    node.style.left = x + 'px';
    node.style.top = y + 'px';
    node.style.margin = '0';
  });
}
window.addEventListener('load', positionNodes);
window.addEventListener('resize', () => requestAnimationFrame(positionNodes));
gsap.delayedCall(0.2, positionNodes);

bookReveal(wheel, { edge: 'top', angle: 45, duration: 1.1, start: 'top 85%' });

const orbitCircle = document.querySelector('.wheel__orbit circle');
if (orbitCircle) {
  const len = orbitCircle.getTotalLength();
  gsap.set(orbitCircle, { strokeDasharray: len, strokeDashoffset: len });
  gsap.to(orbitCircle, {
    strokeDashoffset: 0, duration: 1.4, ease: 'power2.inOut',
    scrollTrigger: { trigger: wheel, start: 'top 85%' }
  });
}

gsap.fromTo('.wheel__center', { opacity: 0, scale: 0.9 }, {
  opacity: 1, scale: 1, duration: 0.9, delay: 0.4, ease: 'power3.out',
  scrollTrigger: { trigger: wheel, start: 'top 80%' }
});

/* nodes open outward from the wheel's center, like little pages unfolding */
let wheelNodesAnimated = false;
function animateWheelNodesIn(){
  if (wheelNodesAnimated) return;
  wheelNodesAnimated = true;
  positionNodes();
  gsap.set(nodes, { transformPerspective: 900 });
  gsap.fromTo(nodes,
    { opacity: 0, rotateY: -110, scale: 0.7 },
    {
      opacity: 1, rotateY: 0, scale: 1,
      duration: 0.85, stagger: 0.1, ease: 'power3.out',
      scrollTrigger: { trigger: wheel, start: 'top 78%' }
    }
  );
}
gsap.delayedCall(0.3, animateWheelNodesIn);
window.addEventListener('load', () => gsap.delayedCall(0.1, animateWheelNodesIn));

let activeIndex = 0;
function setActive(i){
  nodes.forEach(n => n.classList.remove('is-active'));
  nodes[i].classList.add('is-active');
  activeIndex = i;
}
nodes.forEach((node, i) => {
  node.addEventListener('mouseenter', () => setActive(i));
});
setActive(1);

/* auto-cycle highlight while in view */
let cycleTimer = null;
ScrollTrigger.create({
  trigger: wheel,
  start: 'top 80%',
  end: 'bottom 20%',
  onEnter: startCycle,
  onEnterBack: startCycle,
  onLeave: stopCycle,
  onLeaveBack: stopCycle
});
function startCycle(){
  stopCycle();
  cycleTimer = setInterval(() => {
    setActive((activeIndex + 1) % nodes.length);
  }, 1800);
}
function stopCycle(){
  if (cycleTimer) clearInterval(cycleTimer);
}

/* ===================== TESTIMONIALS ===================== */
bookReveal('.testi-track-wrap', { edge: 'top', angle: 50, duration: 1.1, start: 'top 80%' });

const testiTrack = document.getElementById('testiTrack');
function buildTestiScroll(){
  ScrollTrigger.getAll().forEach(st => { if (st.vars.id === 'testi') st.kill(); });
  const scrollAmount = testiTrack.scrollWidth - testiTrack.parentElement.clientWidth;
  if (scrollAmount <= 0) return;
  gsap.to(testiTrack, {
    x: -scrollAmount,
    ease: 'none',
    scrollTrigger: {
      id: 'testi',
      trigger: '.testimonials',
      start: 'top top',
      end: () => '+=' + (scrollAmount + window.innerHeight * 0.4),
      scrub: 0.6,
      pin: true,
      invalidateOnRefresh: true
    }
  });
}
window.addEventListener('load', () => gsap.delayedCall(0.3, buildTestiScroll));

/* ===================== ABOUT ===================== */
bookReveal('.about__copy p', { edge: 'left', angle: 55, duration: 0.9, stagger: 0.12 });
bookReveal('.team-card', { edge: 'left', angle: 100, duration: 1, stagger: 0.12 });

/* ===================== EXPERIENCE / TIMELINE — pages opening left & right ===================== */
bookReveal('.timeline__row--left .timeline__card', { edge: 'left', angle: 95, duration: 1, stagger: 0.1 });
bookReveal('.timeline__row--right .timeline__card', { edge: 'right', angle: 95, duration: 1, stagger: 0.1 });
gsap.fromTo('.timeline__line', { scaleY: 0 }, {
  scaleY: 1, transformOrigin: 'top', duration: 1.2, ease: 'none',
  scrollTrigger: { trigger: '.timeline', start: 'top 70%', end: 'bottom 90%', scrub: 0.5 }
});

/* ===================== CONTACT ===================== */
bookReveal('.contact__panel', { edge: 'left', angle: 60, duration: 1.15 });
bookReveal('.contact__left p', { edge: 'left', angle: 50, duration: 0.9, trigger: '.contact__panel' });
bookReveal('.contact__form > label, .contact__form fieldset, .contact__form button', { edge: 'right', angle: 55, duration: 0.75, stagger: 0.09, trigger: '.contact__form' });
bookReveal('.chk', { edge: 'right', angle: 40, duration: 0.5, stagger: 0.05, trigger: '.contact__form fieldset' });

/* ===================== FORM SUBMIT ===================== */
document.getElementById('contactForm').addEventListener('submit', async e => {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('button[type="submit"]');
  const statusEl = document.getElementById('contactFormStatus');
  const original = btn.textContent;

  const accessKey = form.querySelector('input[name="access_key"]').value;
  if (!accessKey || accessKey === 'YOUR_ACCESS_KEY_HERE') {
    if (statusEl) {
      statusEl.textContent = 'Form is not configured yet. Add your Web3Forms access key in index.html.';
      statusEl.style.color = '#c0392b';
    }
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Sending...';

  try {
    const formData = new FormData(form);
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: formData
    });
    const result = await response.json();

    if (result.success) {
      btn.textContent = 'Sent ✓';
      gsap.fromTo(btn, { scale: 0.95 }, { scale: 1, duration: 0.4, ease: 'back.out(3)' });
      if (statusEl) {
        statusEl.textContent = 'Thanks! Your message has been sent.';
        statusEl.style.color = '#2ecc71';
      }
      form.reset();
    } else {
      throw new Error(result.message || 'Something went wrong.');
    }
  } catch (err) {
    btn.textContent = 'Failed — Try Again';
    if (statusEl) {
      statusEl.textContent = 'Could not send message. Please try again or email directly.';
      statusEl.style.color = '#c0392b';
    }
    console.error('Contact form error:', err);
  } finally {
    btn.disabled = false;
    setTimeout(() => { btn.textContent = original; }, 2500);
  }
});

/* ===================== FOOTER — columns open like the back cover ===================== */
bookReveal('.footer__grid > div', { edge: 'bottom', angle: 50, duration: 0.9, stagger: 0.1, start: 'top 90%' });
bookReveal('.footer__social a', { edge: 'left', angle: 60, duration: 0.5, stagger: 0.1, start: 'top 95%' });
gsap.fromTo('.footer__bottom', { opacity: 0 }, {
  opacity: 1, duration: 0.8,
  scrollTrigger: { trigger: '.footer__bottom', start: 'top 98%' }
});

/* ===================== SMOOTH ANCHOR OFFSET ===================== */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      const y = target.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  });
});

/* =====================================================================
   THREE.JS — HERO AMBIENT SCENE
   A soft field of floating particles plus a slowly spinning wireframe
   icosahedron sitting behind the hero copy. Rotation reacts to the
   mouse and to scroll position (via ScrollTrigger), so it opens up /
   drifts as you scroll past the hero, same as everything else on the
   page is scroll-driven.
   ===================================================================== */
(() => {
  if (typeof THREE === 'undefined') return;
  const canvas = document.getElementById('heroCanvas');
  const heroSectionEl = document.querySelector('.hero');
  if (!canvas || !heroSectionEl) return;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  } catch (e) { return; }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
  camera.position.z = 9;

  function resize() {
    const w = canvas.clientWidth || heroSectionEl.clientWidth;
    const h = canvas.clientHeight || heroSectionEl.clientHeight;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  // ambient particle field
  const particleCount = window.innerWidth < 700 ? 160 : 420;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 18;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 11;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 9;
  }
  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particleMat = new THREE.PointsMaterial({ color: 0x6D4FC2, size: 0.05, transparent: true, opacity: 0.55 });
  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  // NOTE: the wireframe icosahedron + orbiting ring that used to sit here
  // (the purple oval "line" behind the hero copy) have been removed —
  // the real 3D GLTF globe further down now owns that right-side space.

  resize();
  window.addEventListener('resize', resize);

  let mouseX = 0, mouseY = 0;
  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = (e.clientY / window.innerHeight) * 2 - 1;
  });

  // scroll-linked drift: the whole scene tilts/scatters as the hero scrolls away
  if (!reduceMotion) {
    gsap.to(particles.rotation, { y: 0.6, x: 0.2, scrollTrigger: { trigger: heroSectionEl, start: 'top top', end: 'bottom top', scrub: 1 } });
    gsap.to(camera.position, { z: 6, scrollTrigger: { trigger: heroSectionEl, start: 'top top', end: 'bottom top', scrub: 1 } });
  }

  let heroInView = true;
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entries) => { heroInView = entries[0].isIntersecting; }, { threshold: 0 }).observe(heroSectionEl);
  }

  function animate() {
    requestAnimationFrame(animate);
    if (!heroInView) return;
    if (!reduceMotion) {
      particles.rotation.y += 0.0003;
      camera.position.x += (mouseX * 0.9 - camera.position.x) * 0.02;
      camera.position.y += (-mouseY * 0.6 - camera.position.y) * 0.02;
      camera.lookAt(scene.position);
    }
    renderer.render(scene, camera);
  }
  animate();
})();

/* =====================================================================
   THREE.JS — CONTACT SECTION AMBIENT SHAPE
   A slow-spinning wireframe torus knot drifting behind the contact
   panel, scaling in as the section scrolls into view.
   ===================================================================== */
(() => {
  if (typeof THREE === 'undefined') return;
  const canvas = document.getElementById('contactCanvas');
  const contactSection = document.querySelector('.contact');
  if (!canvas || !contactSection) return;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  } catch (e) { return; }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.z = 7;

  function resize() {
    const w = canvas.clientWidth || contactSection.clientWidth;
    const h = canvas.clientHeight || contactSection.clientHeight;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  const knotGeo = new THREE.TorusKnotGeometry(1.3, 0.32, 120, 12);
  const knotMat = new THREE.MeshBasicMaterial({ color: 0x1C1B22, wireframe: true, transparent: true, opacity: 0.22 });
  const knot = new THREE.Mesh(knotGeo, knotMat);
  scene.add(knot);

  resize();
  window.addEventListener('resize', resize);

  gsap.set(knot.scale, { x: 0, y: 0, z: 0 });
  gsap.to(knot.scale, {
    x: 1, y: 1, z: 1, duration: 1.4, ease: 'power3.out',
    scrollTrigger: { trigger: contactSection, start: 'top 75%' }
  });

  let sectionInView = false;
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entries) => { sectionInView = entries[0].isIntersecting; }, { threshold: 0 }).observe(contactSection);
  }

  function animate() {
    requestAnimationFrame(animate);
    if (!sectionInView) return;
    if (!reduceMotion) {
      knot.rotation.x += 0.0018;
      knot.rotation.y += 0.0026;
    }
    renderer.render(scene, camera);
  }
  animate();
})();

/* =====================================================================
   THREE.JS — HERO 3D GLOBE (GLTF MODEL)
   Loads the real 3D world model into the canvas that sits where the
   flat globe image used to be. Auto-spins continuously like a slowly
   turning earth, keeps the same mouse-parallax drift and click-drag
   rotation the old flat image had, just driven in true 3D now.
   ===================================================================== */
(() => {
  if (typeof THREE === 'undefined' || typeof THREE.GLTFLoader === 'undefined') return;
  const canvas = document.getElementById('heroGlobeCanvas');
  const globeWrap = document.querySelector('.hero__globe');
  if (!canvas || !globeWrap) return;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  } catch (e) { return; }
  renderer.outputEncoding = THREE.sRGBEncoding;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 0, 7.2);

  // outer group holds the real-world axial tilt (like Earth's 23.4° tilt),
  // inner group is the one that actually spins around that tilted axis —
  // this is what makes the rotation read as "real world" instead of a
  // toy object spinning flat on screen.
  const axisGroup = new THREE.Group();
  const worldTilt = 23.4 * (Math.PI / 180);
  axisGroup.rotation.z = worldTilt;
  scene.add(axisGroup);

  const globeGroup = new THREE.Group();
  axisGroup.add(globeGroup);

  // lighting — soft ambient fill plus a key + purple rim light to match the brand palette
  scene.add(new THREE.AmbientLight(0xffffff, 0.75));
  const keyLight = new THREE.DirectionalLight(0xffffff, 1.1);
  keyLight.position.set(4, 3, 6);
  scene.add(keyLight);
  const rimLight = new THREE.DirectionalLight(0x6D4FC2, 1.4);
  rimLight.position.set(-5, -2, -4);
  scene.add(rimLight);

  function resize() {
    const w = canvas.clientWidth || globeWrap.clientWidth;
    const h = canvas.clientHeight || w;
    if (!w || !h) return;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  const loader = new THREE.GLTFLoader();
  loader.load(
    'assets/models/timeworx-world-4045.glb',
    (gltf) => {
      const model = gltf.scene;

      // centre + normalise scale so the model fills the group consistently
      const box = new THREE.Box3().setFromObject(model);
      const size = new THREE.Vector3();
      const center = new THREE.Vector3();
      box.getSize(size);
      box.getCenter(center);
      model.position.sub(center);
      const maxDim = Math.max(size.x, size.y, size.z) || 1;
      const scale = 3.6 / maxDim;
      model.scale.setScalar(scale);

      globeGroup.add(model);
      resize();
    },
    undefined,
    (err) => console.warn('Hero globe model failed to load:', err)
  );

  resize();
  window.addEventListener('resize', resize);

  // constant, single-direction spin about the tilted axis — a real planet
  // never reverses or wobbles its own rotation, so this stays one steady speed
  const autoSpinSpeed = 0.0022; // radians per frame (~West → East, like Earth)
  let dragRotY = 0;
  let isDragging = false;
  let lastX = 0;

  // gentle whole-scene parallax (very subtle) driven by mouse position,
  // applied to the tilted axis group only — the spin itself never changes
  let targetTiltX = 0, targetTiltY = 0;
  let tiltX = 0, tiltY = 0;
  const followStrength = 0.05;
  const maxTilt = 0.08; // radians — small, so it reads as parallax not wobble

  window.addEventListener('mousemove', (e) => {
    const nx = (e.clientX / window.innerWidth) * 2 - 1;
    const ny = (e.clientY / window.innerHeight) * 2 - 1;
    targetTiltY = nx * maxTilt;
    targetTiltX = -ny * maxTilt;
  });

  // dragging only nudges the spin forward/back, like giving the globe a push —
  // it doesn't tilt the axis, so the rotation always still looks natural
  const startDrag = (clientX) => { isDragging = true; lastX = clientX; };
  const moveDrag = (clientX) => {
    if (!isDragging) return;
    dragRotY += (clientX - lastX) * 0.008;
    lastX = clientX;
  };
  const endDrag = () => { isDragging = false; };

  canvas.addEventListener('mousedown', (e) => { e.preventDefault(); startDrag(e.clientX); });
  window.addEventListener('mousemove', (e) => moveDrag(e.clientX));
  window.addEventListener('mouseup', endDrag);

  canvas.addEventListener('touchstart', (e) => startDrag(e.touches[0].clientX), { passive: true });
  window.addEventListener('touchmove', (e) => { if (isDragging) moveDrag(e.touches[0].clientX); }, { passive: true });
  window.addEventListener('touchend', endDrag);

  let heroInView = true;
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entries) => { heroInView = entries[0].isIntersecting; }, { threshold: 0 }).observe(globeWrap);
  }

  let currentRotY = 0;
  function animate() {
    requestAnimationFrame(animate);
    if (!heroInView) return;
    if (!reduceMotion) {
      currentRotY += autoSpinSpeed;
    }
    tiltX += (targetTiltX - tiltX) * followStrength;
    tiltY += (targetTiltY - tiltY) * followStrength;

    // pure single-axis spin, exactly like a real planet turning on its axis
    globeGroup.rotation.y = currentRotY + dragRotY;
    // subtle parallax lives on the tilted axis group, on top of the fixed
    // real-world tilt set once above — the spin itself never changes
    axisGroup.rotation.x = tiltX;
    axisGroup.rotation.y = tiltY;

    renderer.render(scene, camera);
  }
  animate();
})();
