/**
 * Jiggy Portfolio, scroll motion
 * Three scroll-linked moments, each with one job:
 *   1. The X-ray curtain sweeps from the shipped screen to its source as the stage passes (the page's story).
 *   2. The Viajero timeline draws left to right as you read it (time moving forward).
 *   3. Each project's media settles in once when it arrives (hierarchy: the work, then the words).
 *
 * Nothing is hidden by CSS. With scripts off, a CDN down, or reduced motion on, the page is complete and still.
 */
(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);
  document.documentElement.classList.add('has-motion');

  // Hero: one quiet settle on load, so the eye lands on the headline first
  gsap.from('[data-hero-copy]', { y: 16, opacity: 0, duration: 0.6, stagger: 0.08, ease: 'expo.out' });

  // 1. X-ray: scrubbed (tied to the scrollbar), not pinned, so the page never stops scrolling.
  //    Entering from below shows mostly screen; by the time the stage is centred, most of the source is showing.
  const xray = document.querySelector('[data-xray]');
  if (xray && typeof window.xrayScrub === 'function') {
    window.xrayScrub(92);
    ScrollTrigger.create({
      trigger: xray,
      start: 'top 85%',
      end: 'center 40%',
      scrub: true,
      onUpdate: (self) => window.xrayScrub(92 - self.progress * 64),
    });
  }

  // 2. Timeline: animate one CSS variable; the CSS turns it into a scaleX on the amber line
  const timeline = document.querySelector('[data-timeline]');
  if (timeline && window.matchMedia('(min-width: 60rem)').matches) {
    const items = timeline.querySelectorAll('.timeline__item');
    const tl = gsap.timeline({
      scrollTrigger: { trigger: timeline, start: 'top 80%', end: 'top 35%', scrub: true },
    });
    tl.fromTo(timeline, { '--progress': 0 }, { '--progress': 1, ease: 'none', duration: items.length }, 0);
    items.forEach((item, i) => {
      tl.fromTo(item, { opacity: 0.3 }, { opacity: 1, ease: 'none', duration: 0.5 }, i);
    });
  }

  // 3. Media: the page's one reveal, played once per project
  gsap.utils.toArray('[data-reveal]').forEach((el) => {
    gsap.from(el, {
      y: 32,
      opacity: 0,
      duration: 0.8,
      ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
  });

  // Filtering the work list changes page height; images and fonts do too once they load
  const search = document.getElementById('cmdSearch');
  if (search) search.addEventListener('input', () => ScrollTrigger.refresh());
  window.addEventListener('load', () => ScrollTrigger.refresh());
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
})();
