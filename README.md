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
  - Core Enterprise Dealership Workflows (Java Swing Desktop ERP, MySQL schema tuning)
  - Legacy Java 7/8 modernization and zero-regression production maintenance

## Architecture & Motion Engineering

- **Motion Engine:** [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) for three scroll-linked moments in `js/motion.js` (X-ray curtain sweep, Viajero timeline draw, one media reveal). Native scrolling, nothing pinned.
- **Styling:** Hand-written CSS on custom tokens (`tokens.css`, `base.css`, `hallmark.css`): cool paper, the Race Clock's amber, set in Rethink Sans and JetBrains Mono. Light and dark follow the system setting.
- **Accessibility:** Automatic degradation under `prefers-reduced-motion: reduce`.
- **Hosting:** Optimized for [Vercel](https://vercel.com) with immutable asset caching.
