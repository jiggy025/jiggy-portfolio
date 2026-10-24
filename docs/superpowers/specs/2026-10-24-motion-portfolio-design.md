# Motion-Driven Developer Portfolio Design Specification

**Date:** 2026-10-24  
**Project:** Jiggy B. Palconit Developer Portfolio Revamp  
**Target Deployment:** Vercel (`https://jiggy-portfolio.vercel.app`)  
**Design Read:** Portfolio for technical recruiters and engineering leaders, with an editorial motion-driven dark-tech language (inspired by Lusion), leaning toward Tailwind utilities, Lenis inertia scroll, GSAP ScrollTrigger, and restrained crimson focal accents.

---

## 1. Core Dials & Aesthetic System

* **`DESIGN_VARIANCE: 8`** (Asymmetric, editorial layout, varied media heights, breaks out of generic grids)
* **`MOTION_INTENSITY: 8`** (Smooth momentum scroll, sticky-stack featured work, magnetic micro-interactions)
* **`VISUAL_DENSITY: 3`** (Spacious, airy typography with generous breathing room)

### Color Palette (Obsidian & Crimson)
* **Canvas Background:** Pure deep obsidian `#07080b`
* **Card Surface:** Translucent smoked obsidian `rgba(13, 16, 23, 0.75)` with 1px border `rgba(255, 255, 255, 0.08)` and subtle inner refraction
* **Primary Text:** Crisp off-white `#f8fafc`
* **Muted Text:** Slate `#94a3b8`
* **Focal Accent:** High-contrast crimson `#ef4444` / deep red `#dc2626` (strictly locked across the entire site)

### Typography
* **Display Headlines:** Bold geometric sans (`Archivo` / `Space Grotesk`)
* **Technical Telemetry & Labels:** Monospace (`JetBrains Mono`)
* **Body Text:** Clean legible sans (`Space Grotesk`)

---

## 2. Information Architecture

### Navigation (Fixed HUD, 64px Height)
* **Left:** `JIGGY B. PALCONIT` with mono sub-label `SOFTWARE DEVELOPER`
* **Center:** Nav links: `Work`, `Arsenal`, `Experience`, `Contact`
* **Right:** Tactical CTA: `Get in touch` (tactile spring hover, WCAG AA contrast)

### Hero Section (`min-h-[100dvh]`, Left-Aligned Asymmetric)
* Fits within initial viewport on all standard devices (no forced scroll for primary actions).
* **Eyebrow:** `Software Developer - Viajero Motorcycles Inc. (9 Months)`
* **Headline (2 lines max):**
  ```
  BUILDING HIGH-INTEGRITY SYSTEMS.
  COMMANDING LOGIC & MOTION.
  ```
* **Subtext (under 20 words):**
  `Software engineer specializing in enterprise Java, cross-platform Flutter, and high-performance database architectures.`
* **Action CTAs:**
  * `View Selected Work` (smooth scroll trigger to featured projects)
  * `Download CV` (direct access to PDF resume)

---

## 3. Featured Work: Lusion-Style Sticky Stack

Each project occupies an expansive card that pins at viewport top (`start: "top top"`) and scales down as the next project glides in.

### Project 1: JRF Pitch Film & Enterprise Presentation
* **Type:** Motion Design & Corporate Systems Film
* **Medium:** HTML5 video showcase (`jrf-film-final.mp4`) with custom play/pause and mute controls
* **Badge:** `Motion engineered with Claude & Remotion`
* **Telemetry:** 1080p 60 FPS timeline, asset tracking & repair workflow visualization, custom audio design
* **Highlights:** Storyboarded, coded, and rendered entirely in code via Remotion; showcases complex enterprise software flows to stakeholders

### Project 2: Race Clock (Multi-Category LED Wall PWA)
* **Type:** Real-Time Timing System & Offline PWA
* **Medium:** Live interactive preview card + external link to `https://race-clock-ten.vercel.app/`
* **Telemetry:** Dual-screen `localStorage` sync, WakeLock API, TypeScript, Vite, Vitest
* **Highlights:** Built for live race operators; control console on laptop screen synchronized with amber LED wall output; 100% offline-ready

### Project 3: Langga Loan Tracker (Mobile App & Motion Reel)
* **Type:** React Native & Expo Mobile Application
* **Medium:** Showcase reel (`langga-reel-0.75x.mp4`) with custom player
* **Badge:** `Motion engineered with Claude & Remotion`
* **Telemetry:** React Native, Expo, 60 FPS Reanimated spring physics, local sandboxed encryption
* **Highlights:** Personal loan payoff tracker with 3D companion mascot, context-aware affirmations, and private PIN-protected vault

### Project 4: Rent-a-Box System (Flutter Local-First Ledger App)
* **Type:** Mobile Business Management System (APK)
* **Medium:** Multi-screen UI showcase featuring real screenshot assets (`fast-box-assignment`, `meticulous-sales-logging`, `instant-vacancy-check`)
* **Telemetry:** Flutter, Dart, SQLite local-first persistence, transactional sales logs
* **Highlights:** Solves multi-tenant rental management with instant vacancy checks and per-unit profitability analytics

### Project 5: MIS Calendar & Viber Alerts System
* **Type:** Enterprise Automation & PWA
* **Medium:** Architectural card with dispatch logs and real-time UI preview
* **Telemetry:** Supabase PostgreSQL, Edge Functions, Viber automated notifications, service worker
* **Highlights:** Real-time event coordination for enterprise team members with automatic push notifications

---

## 4. Professional Foundation & Technical Matrix

### Production Duty: Viajero Motorcycles Inc.
* **Role:** Software Developer
* **Duration:** Feb 2026 - Present (9 Months)
* **Responsibilities:**
  * Modernizing and maintaining core dealership Java 7/8 and Java Swing desktop ERP systems.
  * Architecting complex MySQL database queries, inventory pipelines, and automated reporting.
  * Enforcing defensive programming with zero regressions across mission-critical workflows.

### Engineering Matrix
* **Backend & Enterprise:** Java 7/8/17/21, Spring patterns, Java Swing UI, multithreaded desktop concurrency.
* **Data Infrastructure:** MySQL relational architecture, index tuning, SQLite embedded storage.
* **Client & Mobile:** Flutter + Dart, React Native / Expo, React web apps, offline-first synchronization.
* **Accreditations:** BS in Information Technology (STI College General Santos, TESDA DICT Scholar) & Computer System Servicing NC II.

---

## 5. Contact & Footer

* **Direct Transmission:**
  * Interactive one-click email copy with instant feedback toast (`jigspals025@gmail.com`).
  * Direct contact options (phone and GitHub).
* **Footer:** Single-line clean copyright and return-to-top anchor.

---

## 6. Motion & Performance Engineering

### Libraries & Dependencies
* **Lenis:** Lightweight momentum inertia scrolling for 60-120 FPS glide.
* **GSAP & ScrollTrigger:** Scroll-driven pinning, scrubbed card scaling, and entrance choreography.
* **Tailwind CSS:** Responsive utility styling with dark-mode color tokens.

### Anti-Slop & Quality Guardrails
* **No em-dash (`—`) characters:** Hyphen `-` used universally.
* **No arbitrary decorative status dots or section numbering (`01.`, `02.`, etc.).**
* **No fake screenshots or div-based mocks:** All showcased items use real videos, live URLs, or actual repo screenshots.
* **Reduced Motion:** Fully complies with `prefers-reduced-motion: reduce` by disabling scroll pinning and playing cards as static accessible stacks.
* **Hardware Acceleration:** Animations restricted to `transform` and `opacity`.
* **Zero Custom Cursor:** Native cursor behavior preserved for clean accessibility and responsiveness.
