/**
 * Jiggy Portfolio - Motion and Interaction Engine
 * Lenis Inertia Scroll, GSAP ScrollTrigger Sticky Stack, Video Controls, and Interactive Handlers
 */

// 1. Reduced Motion Detection
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// 2. Initialize Lenis (if not reduced motion and Lenis is available)
let lenis;
if (!prefersReducedMotion && typeof Lenis !== 'undefined') {
  lenis = new Lenis({
    duration: 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 1.5,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Smooth anchor clicks
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#' || href === '') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        lenis.scrollTo(target, { offset: -64 });
      }
    });
  });
}

// 3. GSAP ScrollTrigger & Sticky Stack Integration
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);

  if (lenis) {
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  }

  if (!prefersReducedMotion) {
    // Hero Entrance Timeline
    gsap.from('#hero h1', {
      opacity: 0,
      y: 30,
      duration: 0.9,
      ease: 'power3.out',
      delay: 0.2
    });
    gsap.from('#hero p, #hero .flex.flex-wrap', {
      opacity: 0,
      y: 20,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power2.out',
      delay: 0.4
    });

    // Sticky Stack ScrollTrigger for Featured Work Cards
    // CSS handles the native sticky pinning (top-20) seamlessly at 120 FPS.
    // GSAP ScrollTrigger purely drives the cinematic depth: scaling and dimming the previous card as the next arrives.
    const cards = gsap.utils.toArray('.stack-card');
    cards.forEach((card, i) => {
      if (i === cards.length - 1) return;
      const inner = card.querySelector('.stack-card-inner') || card;
      const nextCard = cards[i + 1];

      if (inner && nextCard) {
        gsap.to(inner, {
          scale: 0.93,
          opacity: 0.4,
          y: -24,
          ease: 'none',
          scrollTrigger: {
            trigger: nextCard,
            start: 'top bottom',
            end: 'top top+=80',
            scrub: true,
          },
        });
      }
    });

    // Refresh ScrollTrigger after assets finish loading
    window.addEventListener('load', () => {
      ScrollTrigger.refresh();
    });
  }
}

// 4. Intelligent Video Autoplay / Pause Manager
// Ensures video plays ONLY when its card is the active visible card, and immediately pauses
// when the user scrolls down past it, when another card covers it, or when leaving the work section.
function updateCardVideoPlayback() {
  const cards = gsap.utils.toArray('.stack-card');
  const vh = window.innerHeight;

  cards.forEach((card, i) => {
    const video = card.querySelector('video');
    if (!video) return;

    const rect = card.getBoundingClientRect();
    const nextCard = cards[i + 1];
    let isCovered = false;

    if (nextCard) {
      const nextRect = nextCard.getBoundingClientRect();
      // If the next card has scrolled up to the sticky position (top <= 96px), it covers this card!
      if (nextRect.top <= 96) {
        isCovered = true;
      }
    }

    // Card is active if its top is near the viewport header area and not covered,
    // and hasn't been scrolled past completely.
    const isInView = rect.top < vh - 100 && rect.bottom > 80;

    if (isInView && !isCovered) {
      if (video.paused && !video.dataset.userPaused) {
        video.play().catch(() => {});
      }
    } else {
      // Scrolled past or covered: PAUSE IMMEDIATELY
      if (!video.paused) {
        video.pause();
      }
    }
  });
}

// Hook into Lenis scroll, native window scroll, and resize
if (lenis) {
  lenis.on('scroll', updateCardVideoPlayback);
}
window.addEventListener('scroll', updateCardVideoPlayback, { passive: true });
window.addEventListener('resize', updateCardVideoPlayback, { passive: true });
window.addEventListener('load', updateCardVideoPlayback);

// 5. Video Controls, LED Wall Timer, and Clipboard Handler
// Video Play/Pause, Mute/Unmute & Fullscreen Controls
document.querySelectorAll('.video-card-wrapper').forEach((wrapper) => {
  const video = wrapper.querySelector('video');
  const playBtn = wrapper.querySelector('.video-play-btn');
  const muteBtn = wrapper.querySelector('.video-mute-btn');
  const fullscreenBtn = wrapper.querySelector('.video-fullscreen-btn');

  if (video) {
    video.addEventListener('play', () => {
      playBtn?.querySelector('.play-icon')?.classList.add('hidden');
      playBtn?.querySelector('.pause-icon')?.classList.remove('hidden');
    });
    video.addEventListener('pause', () => {
      playBtn?.querySelector('.play-icon')?.classList.remove('hidden');
      playBtn?.querySelector('.pause-icon')?.classList.add('hidden');
    });
    video.addEventListener('volumechange', () => {
      if (video.muted) {
        muteBtn?.querySelector('.mute-icon')?.classList.remove('hidden');
        muteBtn?.querySelector('.unmute-icon')?.classList.add('hidden');
      } else {
        muteBtn?.querySelector('.mute-icon')?.classList.add('hidden');
        muteBtn?.querySelector('.unmute-icon')?.classList.remove('hidden');
      }
    });

    if (playBtn) {
      playBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (video.paused) {
          delete video.dataset.userPaused;
          video.play().catch(() => {});
        } else {
          video.dataset.userPaused = 'true';
          video.pause();
        }
      });
    }

    if (muteBtn) {
      muteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        video.muted = !video.muted;
      });
    }

    if (fullscreenBtn) {
      fullscreenBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (video.requestFullscreen) {
          video.requestFullscreen();
        } else if (video.webkitRequestFullscreen) {
          video.webkitRequestFullscreen();
        } else if (video.msRequestFullscreen) {
          video.msRequestFullscreen();
        }
      });
    }
  }
});

// Simulated Race Clock LED Wall Counter
const ledWallTimer = document.getElementById('ledWallTimer');
if (ledWallTimer) {
  const startTime = Date.now();
  const baseMs = (42 * 60 + 18) * 1000 + 450;
  setInterval(() => {
    const elapsed = (Date.now() - startTime) % (3600 * 1000);
    const total = baseMs + elapsed;
    const m = Math.floor((total / (1000 * 60)) % 60).toString().padStart(2, '0');
    const s = Math.floor((total / 1000) % 60).toString().padStart(2, '0');
    const ms = Math.floor((total % 1000) / 10).toString().padStart(2, '0');
    ledWallTimer.textContent = `00:${m}:${s}.${ms}`;
  }, 45);
}

// Interactive Clipboard Handler
const copyBtn = document.getElementById('copyEmailBtn');
const copyText = document.getElementById('copyEmailText');
const toast = document.getElementById('toastNotification');

if (copyBtn) {
  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText('jigspals025@gmail.com');
      if (copyText) copyText.textContent = 'Copied to Clipboard!';
      if (toast) {
        toast.classList.remove('translate-y-20', 'opacity-0');
        toast.classList.add('translate-y-0', 'opacity-100');
      }
      setTimeout(() => {
        if (copyText) copyText.textContent = 'jigspals025@gmail.com';
        if (toast) {
          toast.classList.add('translate-y-20', 'opacity-0');
          toast.classList.remove('translate-y-0', 'opacity-100');
        }
      }, 2500);
    } catch (err) {
      window.location.href = 'mailto:jigspals025@gmail.com';
    }
  });
}

// 6. Screenshot Lightbox Modal Handler
const lightbox = document.getElementById('imageLightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.getElementById('lightboxClose');

if (lightbox && lightboxImg) {
  document.querySelectorAll('.screenshot-thumb').forEach((thumb) => {
    thumb.addEventListener('click', (e) => {
      e.stopPropagation();
      const src = thumb.getAttribute('data-img');
      const caption = thumb.getAttribute('data-caption') || '';
      lightboxImg.src = src;
      if (lightboxCaption) lightboxCaption.textContent = caption;
      lightbox.classList.remove('hidden');
      setTimeout(() => {
        lightbox.classList.remove('opacity-0');
        lightbox.classList.add('flex', 'opacity-100');
      }, 10);
      document.body.style.overflow = 'hidden';
    });
  });

  const closeLightbox = () => {
    lightbox.classList.remove('opacity-100');
    lightbox.classList.add('opacity-0');
    setTimeout(() => {
      lightbox.classList.remove('flex');
      lightbox.classList.add('hidden');
      lightboxImg.src = '';
      document.body.style.overflow = '';
    }, 200);
  };

  lightboxClose?.addEventListener('click', (e) => {
    e.stopPropagation();
    closeLightbox();
  });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.id === 'imageLightbox') {
      closeLightbox();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !lightbox.classList.contains('hidden')) {
      closeLightbox();
    }
  });
}
