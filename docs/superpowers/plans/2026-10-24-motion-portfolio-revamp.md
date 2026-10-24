# Motion-Driven Developer Portfolio Revamp Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the single-page portfolio into a high-performance, motion-driven developer portfolio inspired by Lusion, featuring smooth Lenis momentum scrolling, a GSAP ScrollTrigger sticky-stack showcase for 5 real projects, and clean anti-slop dark-tech aesthetics.

**Architecture:** Vanilla modern web architecture with Tailwind CSS, Lenis momentum scroll engine, and GSAP ScrollTrigger for pinned card transitions. Static asset structure optimized for high-speed Vercel hosting with zero hydration overhead and full `prefers-reduced-motion` accessibility.

**Tech Stack:** HTML5, CSS3, Tailwind CSS, Lenis (`@studio-freight/lenis` / `lenis`), GSAP Core & ScrollTrigger, Remotion-rendered motion media assets, Vercel.

---

### Task 1: Asset Pipeline & Clean Up Obsolete Media

**Files:**
- Create directory: `D:/Jiggy_Files/jiggy-portfolio/assets/videos/`
- Create directory: `D:/Jiggy_Files/jiggy-portfolio/assets/images/rent-a-box/`
- Delete: `D:/Jiggy_Files/jiggy-portfolio/unyielding-itachis-sharingan.1920x1080.mp4`
- Delete: `D:/Jiggy_Files/jiggy-portfolio/itachi_mangekyo.mp4`
- Delete: `D:/Jiggy_Files/jiggy-portfolio/sharingan_evolution.mp4`

- [ ] **Step 1: Create new asset directories**
  Create `assets/videos` and `assets/images/rent-a-box` in `D:/Jiggy_Files/jiggy-portfolio`.

- [ ] **Step 2: Copy flagship Remotion motion videos**
  Copy `D:\Jiggy_Files\motionmaxxing\jrf-remotion\out\jrf-film-final.mp4` to `assets/videos/jrf-pitch.mp4`.
  Copy `D:\Jiggy_Files\videos\my-video\out\langga-reel-0.75x.mp4` to `assets/videos/langga-reel.mp4`.

- [ ] **Step 3: Fetch authentic rent-a-box-sys screenshots from repository**
  Download high-resolution screenshots from the `jiggy025/rent-a-box-sys` GitHub repository (`fast-box-assignment.png`, `meticulous-sales-logging.png`, `instant-vacancy-check.png`, `unified-payout-finance-control.png`) into `assets/images/rent-a-box/`.

- [ ] **Step 4: Remove obsolete anime video files from git tracking and disk**
  Remove `unyielding-itachis-sharingan.1920x1080.mp4`, `itachi_mangekyo.mp4`, and `sharingan_evolution.mp4` to save ~10MB.

- [ ] **Step 5: Verify asset structure and commit**
  Run: `Get-ChildItem -Recurse assets` to confirm all media files exist.
  Commit: `git add assets/ .gitignore && git commit -m "chore: setup motion video and project screenshot assets"`

---

### Task 2: Update Vercel Configuration & Head Metadata

**Files:**
- Modify: `D:/Jiggy_Files/jiggy-portfolio/vercel.json`
- Modify: `D:/Jiggy_Files/jiggy-portfolio/index.html` (Head section)

- [ ] **Step 1: Update vercel.json caching rules for modern assets**
  Ensure video and image assets carry immutable caching headers for high-performance delivery.

- [ ] **Step 2: Define Open Graph, Twitter Cards, and SEO meta tags in index.html**
  Set proper title (`Jiggy B. Palconit - Software Developer`), description, canonical URL, and dark theme-color (`#07080b`).

- [ ] **Step 3: Import verified CDN packages for Lenis, GSAP, and typography**
  Include Google Fonts (`Archivo`, `Space Grotesk`, `JetBrains Mono`), GSAP 3.12+ and ScrollTrigger, and Lenis 1.1+ via CDN.

- [ ] **Step 4: Verify metadata and headers**
  Validate `vercel.json` format using PowerShell `Get-Content vercel.json | ConvertFrom-Json`.

- [ ] **Step 5: Commit**
  Commit: `git add vercel.json index.html && git commit -m "feat: configure SEO metadata and motion script CDNs"`

---

### Task 3: Build Precision Navigation & Hero Viewport

**Files:**
- Modify: `D:/Jiggy_Files/jiggy-portfolio/index.html` (Header and Hero sections)

- [ ] **Step 1: Implement 64px Fixed Precision Header**
  Single-line layout on desktop:
  - Left: `JIGGY B. PALCONIT` with mono subtext `SOFTWARE DEVELOPER`.
  - Center: Minimal text links (`Work`, `Arsenal`, `Experience`, `Contact`).
  - Right: Tactical primary CTA button `Get in touch` linking to `#contact`.

- [ ] **Step 2: Implement Asymmetric Left-Aligned Hero Section (`min-h-[100dvh]`)**
  - Status badge: `Software Developer - Viajero Motorcycles Inc. (9 Months)` with subtle status indicator.
  - Headline (max 2 lines): `BUILDING HIGH-INTEGRITY SYSTEMS. COMMANDING LOGIC & MOTION.`
  - Subtext (14 words): `Software engineer specializing in enterprise Java, cross-platform Flutter, and high-performance database architectures.`
  - Action buttons: `View Selected Work` (`btn-crimson`) and `Download CV` (`btn-stealth`).
  - Telemetry strip: Enterprise Java / MySQL, Cross-Platform Flutter, Real-Time PWA, General Santos PH.

- [ ] **Step 3: Verify viewport constraints**
  Confirm hero content and CTAs fit within `min-h-[100dvh]` without forcing a scroll on 1080p and laptop screens.

- [ ] **Step 4: Commit**
  Commit: `git add index.html && git commit -m "feat: implement precision header and hero section"`

---

### Task 4: Implement Lusion-Style Sticky-Stack Featured Work Showcase

**Files:**
- Modify: `D:/Jiggy_Files/jiggy-portfolio/index.html` (Featured Work section)

- [ ] **Step 1: Construct sticky-stack container structure**
  Implement the container `<section id="work" class="relative">` with cards wrapped in `.stack-card` classes with `sticky top-0 min-h-[100dvh] flex items-center justify-center py-12`.

- [ ] **Step 2: Build Card 1: JRF Pitch Film (Remotion & Motion Design)**
  - Media: Custom video player for `assets/videos/jrf-pitch.mp4` with loop, mute/unmute toggle, and play/pause controls.
  - Badge: `Motion engineered with Claude & Remotion`.
  - Specs: Enterprise workflow visualization, asset tracking telemetry, custom audio score.

- [ ] **Step 3: Build Card 2: Race Clock (LED Wall Multi-Category PWA)**
  - Media: Interactive amber LED timer mockup with live preview indicator.
  - Live link: `https://race-clock-ten.vercel.app/` with launch button.
  - Specs: Dual-screen `localStorage` sync, WakeLock API, TypeScript, Vite, offline-ready service worker.

- [ ] **Step 4: Build Card 3: Langga Loan Tracker (Mobile App & Motion Reel)**
  - Media: Custom video player for `assets/videos/langga-reel.mp4`.
  - Badge: `Motion engineered with Claude & Remotion`.
  - Specs: React Native & Expo, 60 FPS spring physics, 3D companion mascot, PIN-protected vault.

- [ ] **Step 5: Build Card 4: Rent-a-Box System (Flutter Local-First Ledger App)**
  - Media: 3-column screenshot showcase with authentic assets (`fast-box-assignment.png`, `instant-vacancy-check.png`, `meticulous-sales-logging.png`).
  - Specs: Flutter, Dart, SQLite offline-first persistence, multi-tenant box rentals.
  - Link: Direct link to `https://github.com/jiggy025/rent-a-box-sys`.

- [ ] **Step 6: Build Card 5: MIS Calendar & Viber Alerts System**
  - Media: Real-time calendar dispatch view with automated webhook architecture.
  - Specs: Supabase PostgreSQL, Edge Functions, automated Viber notification pipeline, service worker PWA.
  - Link: Direct link to repository / documentation.

- [ ] **Step 7: Commit**
  Commit: `git add index.html && git commit -m "feat: implement 5 flagship sticky-stack project showcase cards"`

---

### Task 5: Implement Technical Arsenal & Professional Foundation Sections

**Files:**
- Modify: `D:/Jiggy_Files/jiggy-portfolio/index.html` (Arsenal and Experience sections)

- [ ] **Step 1: Build Engineering Arsenal Matrix (Asymmetric 2-Column Split)**
  Break the generic 3-box cliché:
  - Column 1 (Deep Backend & Concurrency): Java 7/8/17/21, multithreaded desktop concurrency, Java Swing GUI, enterprise design patterns.
  - Column 2 (Data Infrastructure & Mobile): MySQL relational architecture, query optimization, SQLite embedded storage, Flutter & React Native client engineering.

- [ ] **Step 2: Build Professional Foundation Section**
  - Viajero Motorcycles Inc.: `Software Developer` (Feb 2026 - Present, 9 Months). Detailed breakdown of enterprise dealership ERP maintenance, legacy refactoring, and zero-regression standards.
  - Prime Developments: Technical support, server operations, and diagnostic rigor.
  - Accreditations: BS in Information Technology (STI College General Santos, TESDA Scholar) and Computer System Servicing NC II.

- [ ] **Step 3: Commit**
  Commit: `git add index.html && git commit -m "feat: build engineering arsenal and professional experience sections"`

---

### Task 6: Implement Interactive Contact Section & Footer

**Files:**
- Modify: `D:/Jiggy_Files/jiggy-portfolio/index.html` (Contact and Footer)

- [ ] **Step 1: Build Direct Transmission Contact Terminal**
  - One-click copy email button with clipboard copy action and feedback toast: `Copied jigspals025@gmail.com to clipboard!`.
  - Direct telephone transmission: `+63 099 2913 1887`.
  - Direct GitHub profile link: `github.com/jiggy025`.

- [ ] **Step 2: Build Single-Line Clean Footer**
  - Left: `© 2026 JIGGY B. PALCONIT. ALL RIGHTS RESERVED.`
  - Right: Clean links to GitHub and `TOP [▲]`.

- [ ] **Step 3: Commit**
  Commit: `git add index.html && git commit -m "feat: add interactive contact section with clipboard copy toast"`

---

### Task 7: Wire Lenis Inertia Scroll & GSAP ScrollTrigger Engine

**Files:**
- Create: `D:/Jiggy_Files/jiggy-portfolio/js/motion.js`
- Modify: `D:/Jiggy_Files/jiggy-portfolio/index.html` (Script import)

- [ ] **Step 1: Initialize Lenis smooth scroll engine**
  ```javascript
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
  ```

- [ ] **Step 2: Connect Lenis to GSAP ScrollTrigger ticker**
  ```javascript
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);
  ```

- [ ] **Step 3: Implement sticky-stack pin and scrub animations**
  ```javascript
  const cards = gsap.utils.toArray('.stack-card');
  cards.forEach((card, i) => {
    if (i === cards.length - 1) return;
    ScrollTrigger.create({
      trigger: card,
      start: 'top top',
      endTrigger: cards[cards.length - 1],
      end: 'top top',
      pin: true,
      pinSpacing: false,
    });
    gsap.to(card, {
      scale: 0.93,
      opacity: 0.45,
      ease: 'none',
      scrollTrigger: {
        trigger: cards[i + 1],
        start: 'top bottom',
        end: 'top top',
        scrub: true,
      },
    });
  });
  ```

- [ ] **Step 4: Add prefers-reduced-motion guardrail**
  Check `window.matchMedia('(prefers-reduced-motion: reduce)').matches` and bypass pinning and transforms if true.

- [ ] **Step 5: Implement video player controls and copy toast handlers**
  Add click listener for copy email with auto-dismissing toast after 2.5 seconds.
  Add video mute/unmute and intersection observer autoplay triggers.

- [ ] **Step 6: Commit**
  Commit: `git add js/motion.js index.html && git commit -m "feat: integrate Lenis inertia scroll and GSAP sticky-stack engine"`

---

### Task 8: Verification, Contrast Audit & Production Build Check

**Files:**
- Modify: `D:/Jiggy_Files/jiggy-portfolio/README.md`
- Inspect: All files in repository

- [ ] **Step 1: Audit all links and external assets**
  Ensure [race-clock-ten.vercel.app](https://race-clock-ten.vercel.app/) and [github.com/jiggy025](https://github.com/jiggy025) are working.
  Verify local video files play smoothly with no 404s.

- [ ] **Step 2: Anti-Slop verification audit**
  - Verify zero em-dash (`—`) characters in copy (search for `—` across `index.html` and `js/motion.js`).
  - Verify zero arbitrary section numbering (`01.`, `02.`).
  - Verify hero fits within initial viewport without scrolling.
  - Verify WCAG AA contrast for all buttons and text labels.

- [ ] **Step 3: Update README.md with revamped tech stack & architecture docs**
  Document the motion engine (Lenis + GSAP ScrollTrigger), Remotion video integration, and deployed projects.

- [ ] **Step 4: Final verification commit**
  Commit: `git add README.md && git commit -m "docs: update documentation for motion-driven portfolio release"`
