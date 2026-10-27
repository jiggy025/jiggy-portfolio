/**
 * Jiggy Portfolio, scroll choreography
 * Lenis gives the page inertia; GSAP ScrollTrigger ties each scene to the scrollbar.
 *
 * Every scene starts from the finished layout in hallmark.css. Nothing is hidden by CSS,
 * so with scripts off, a CDN down, or reduced motion on, the page is complete and still.
 */
(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);
  document.documentElement.classList.add('has-motion');

  const header = document.querySelector('.site-header');
  const navOffset = () => (header ? header.offsetHeight : 0);

  // 1. Lenis inertia scroll, driven by GSAP's ticker so both share one animation frame
  let lenis = null;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', (e) => {
        const id = link.getAttribute('href');
        const target = id && id.length > 1 ? document.querySelector(id) : null;
        if (!target) return;
        e.preventDefault();
        lenis.scrollTo(target, { offset: -navOffset() });
      });
    });
  }

  // 2. Progress spine: a 2px line on the left edge that fills as you read
  const spine = document.querySelector('.spine');
  if (spine) {
    gsap.fromTo(spine, { scaleY: 0 }, {
      scaleY: 1,
      ease: 'none',
      scrollTrigger: { start: 0, end: 'max', scrub: true },
    });
  }

  // 3. Hero entrance: one settle, each line rising out of its own mask
  gsap.from('[data-hero-head] .line__in', {
    yPercent: 60,
    opacity: 0.6,
    duration: 0.7,
    stagger: 0.08,
    ease: 'expo.out',
  });
  gsap.from('[data-hero-copy]', { opacity: 0.6, duration: 0.42, delay: 0.2, ease: 'expo.out' });

  // gsap.matchMedia runs the pinned scenes only on wide screens and reverts them cleanly on resize
  const mm = gsap.matchMedia();
  mm.add('(min-width: 60rem)', () => {
    // 4. Hero exit: the three lines drift apart and dim as the page leaves them
    const lines = gsap.utils.toArray('[data-hero-head] .line');
    const drift = [-6, 5, -3];
    lines.forEach((line, i) => {
      gsap.to(line, {
        xPercent: drift[i] || 0,
        opacity: 0.18,
        ease: 'none',
        scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true },
      });
    });

    // 5. X-ray: pin the inspector and let the scroll sweep the curtain from UI to source
    const xrayPin = document.querySelector('[data-xray-pin]');
    if (xrayPin && typeof window.xrayScrub === 'function') {
      ScrollTrigger.create({
        trigger: xrayPin,
        start: () => `top top+=${navOffset() + 24}`,
        end: '+=120%',
        pin: true,
        scrub: true,
        onUpdate: (self) => window.xrayScrub(96 - self.progress * 88),
      });
    }

    // 6. Viajero log: pin the case, fill the spine, light each entry newest to oldest
    const casePin = document.querySelector('[data-case-pin]');
    const items = gsap.utils.toArray('[data-audit] .audit-trail__item');
    if (casePin && items.length) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: casePin,
          start: () => `top top+=${navOffset() + 24}`,
          end: '+=140%',
          pin: true,
          scrub: true,
        },
      });
      tl.fromTo('[data-audit]', { '--trail': 0 }, { '--trail': 1, ease: 'none', duration: items.length }, 0);
      items.forEach((item, i) => {
        tl.fromTo(item, { opacity: 0.28, x: 24 }, { opacity: 1, x: 0, ease: 'none', duration: 0.6 }, i);
      });
    }

    // 7. Systems rail: pin the section and translate the track sideways while scrolling down
    const workPin = document.querySelector('[data-work-pin]');
    const track = document.querySelector('[data-work-track]');
    const meter = document.querySelector('[data-work-meter]');
    const names = gsap.utils.toArray('[data-work-index] li');
    if (workPin && track) {
      const distance = () => Math.max(0, track.scrollWidth - track.parentElement.clientWidth);
      const markCurrent = (progress) => {
        const visible = gsap.utils.toArray('.work-item').filter((el) => !el.classList.contains('is-filtered-out'));
        const current = Math.round(progress * Math.max(0, visible.length - 1));
        names.forEach((li, i) => li.classList.toggle('is-current', i === current));
      };
      markCurrent(0);

      gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: workPin,
          start: () => `top top+=${navOffset()}`,
          end: () => `+=${distance()}`,
          pin: true,
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (meter) meter.style.transform = `scaleX(${self.progress})`;
            markCurrent(self.progress);
          },
        },
      });
    }

    // 8. Contact: the close rises letter by letter as it scrolls in
    const contactHead = document.querySelector('[data-rise-chars]');
    if (contactHead) {
      const label = contactHead.textContent;
      contactHead.setAttribute('aria-label', label);
      contactHead.textContent = '';
      Array.from(label).forEach((ch) => {
        const span = document.createElement('span');
        span.className = 'char';
        span.setAttribute('aria-hidden', 'true');
        span.textContent = ch === ' ' ? ' ' : ch;
        contactHead.appendChild(span);
      });
      gsap.from(contactHead.children, {
        yPercent: 70,
        opacity: 0.2,
        stagger: 0.04,
        ease: 'none',
        scrollTrigger: { trigger: contactHead, start: 'top 95%', end: 'top 60%', scrub: true },
      });
    }

    return () => {
      // matchMedia revert: put the contact head back to plain text below 60rem
      if (contactHead && contactHead.getAttribute('aria-label')) {
        contactHead.textContent = contactHead.getAttribute('aria-label');
        contactHead.removeAttribute('aria-label');
      }
    };
  });

  // 9. Stack statement: each word brightens in step with the scroll (all widths)
  const statement = document.querySelector('[data-scrub-words]');
  if (statement) {
    const text = statement.textContent.trim();
    statement.setAttribute('aria-label', text);
    statement.textContent = '';
    text.split(' ').forEach((word, i, all) => {
      const span = document.createElement('span');
      span.className = 'word';
      span.setAttribute('aria-hidden', 'true');
      span.textContent = word;
      statement.appendChild(span);
      if (i < all.length - 1) statement.appendChild(document.createTextNode(' '));
    });
    gsap.fromTo(statement.querySelectorAll('.word'), { opacity: 0.2 }, {
      opacity: 1,
      stagger: 0.1,
      ease: 'none',
      scrollTrigger: { trigger: statement, start: 'top 85%', end: 'top 35%', scrub: true },
    });
  }

  // 10. Spec table: rows settle in once, 40ms apart
  gsap.from('[data-spec-table] tbody tr', {
    y: 16,
    opacity: 0.4,
    duration: 0.42,
    stagger: 0.04,
    ease: 'expo.out',
    scrollTrigger: { trigger: '[data-spec-table]', start: 'top 80%', once: true },
  });

  // Filtering the rail changes its length, so re-measure every trigger after the list changes
  const search = document.getElementById('cmdSearch');
  if (search) search.addEventListener('input', () => ScrollTrigger.refresh());

  // Images and fonts change heights after load; re-measure once everything has arrived
  window.addEventListener('load', () => ScrollTrigger.refresh());
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
})();
