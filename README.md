# Jiggy B. Palconit - Software Developer Portfolio

A portfolio that shows each system as it really runs: real screenshots and films, an X-ray that sweeps from a shipped screen to its source as you scroll, and Remotion-engineered films.

## Featured Systems & Projects

1. **JRF Pitch Film & Enterprise Workflow**
   - Motion video engineered with Claude & Remotion
   - Complex enterprise repair, security, and asset-tracking flow visualization
2. **Race Clock (Multi-Category LED Wall PWA)**
   - Deployed at: [race-clock-ten.vercel.app](https://race-clock-ten.vercel.app/)
   - Dual-screen real-time synchronization via `localStorage`, WakeLock API, TypeScript, Vite, offline PWA
3. **Langga Loan Tracker (Mobile App & Motion Reel)**
   - Motion reel engineered with Claude & Remotion
   - React Native & Expo mobile app with 60 FPS Reanimated spring physics and 3D companion mascot
4. **Rent-a-Box System (Flutter Local-First Ledger App)**
   - GitHub: [jiggy025/rent-a-box-sys](https://github.com/jiggy025/rent-a-box-sys)
   - Cross-platform Flutter mobile APK with SQLite local-first persistence for retail box rental hubs
5. **MIS Calendar & Viber Alerts System**
   - Enterprise coordination calendar powered by Supabase PostgreSQL, Edge Functions, and automated Viber notification webhooks

## Production Foundation

- **Software Developer at Viajero Motorcycles Inc. (Feb 2026 - Present, 9 Months)**
  - JRF System: Built Job Request Form workflow in Spring Boot (Java 17) bridging legacy Java 7/8 ERP data.
  - Enterprise ERP Maintenance: Polished Java Swing ERP modules, adhering to AutoCloseable session patterns and tuning MySQL performance.

## Architecture & Motion Engineering

- **Motion Engine:** [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) for three scroll-linked moments in `js/motion.js` (X-ray curtain sweep, Viajero timeline draw, one media reveal). Native scrolling, nothing pinned.
- **Styling:** Hand-written CSS on Hallmark's Cobalt tokens (`tokens.css`, `base.css`, `hallmark.css`): cool paper, one cobalt signal, keycap buttons and cut-corner panels, set in Familjen Grotesk, IBM Plex Sans and JetBrains Mono. The hero field (`js/field.js`) draws the JRF request flow as an ASCII canvas.
- **Accessibility:** Automatic degradation under `prefers-reduced-motion: reduce`.
- **Hosting:** Optimized for [Vercel](https://vercel.com) with immutable asset caching.
