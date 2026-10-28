# Jiggy B. Palconit
**Software Developer**  
General Santos City, PH | +63 992 913 1887 | jigspals025@gmail.com  
[GitHub: github.com/jiggy025](https://github.com/jiggy025) | [Portfolio: jiggy025.github.io](https://jiggy025.github.io)

---

## Technical Skills
- **Languages:** Java (7/8, 17, 21), Dart, TypeScript, JavaScript, SQL (MySQL, PostgreSQL, SQLite), HTML5/CSS3
- **Backend & ERP:** Spring Boot 3.3 (Web, Security, Actuator), Java Swing, Hibernate/JPA, JDBC, JasperReports, Java RMI
- **Mobile & Frontend:** Flutter (BLoC architecture, SQLite, local-first), React Native (Expo, Reanimated), Vite, PWA, Supabase
- **Engineering:** Legacy Modernization, Concurrency Control (Optimistic `@Version`, Queue-Locking), Multi-Branch Sync, Git

---

## Work Experience

### **Software Developer** — Viajero Motorcycles Inc.
*Feb 2026 – Present | General Santos City, Philippines*
- **Engineered greenfield JRF system:** Built a Job Request Form service in **Spring Boot (Java 17)** bridging into a legacy Java 7/8 ERP database with optimistic concurrency (`@Version`) and zero regressions across production branches.
- **Eliminated UI freezing on EDT:** Refactored legacy Swing reporting and transaction modules by enforcing `AutoCloseable` session lifecycles, background worker isolation, and indexed SQL queries.
- **Built algorithmic inventory engine:** Implemented automated reorder calculation (ROQ: `AMC × [ABC - SM]`) with day-anchored windowing across dealership branches, cutting stockout risk.
- **Prevented multi-store race conditions:** Designed transaction lock checks and out-of-stock guard restrictions for cross-branch transfers (`Viajero ↔ Jicjam`).
- **Engineered FACC ↔ ACC bridge:** Built bidirectional inter-module accounting adapter with reusable transaction components, in-memory caching (`HashMap`), and locked payroll queues.

**Prior Technical Experience:**
- **Technical Support VA** — Prime Developments *(2024 – 2025)*: Handled user account sync and virtual environment troubleshooting.
- **IT Support (SPES)** — LGU General Santos City (ICTD) *(2023)*: Diagnosed PC hardware and deployed LAN network routing across offices.

---

## Shipped Projects

- **Rent-a-Box SQLite Ledger (Espasyo)** | *Flutter, Dart, SQLite, BLoC* | [GitHub](https://github.com/jiggy025/rent-a-box-sys)  
  Offline-first Flutter retail management APK with 53 passing automated tests; features real-time vacancy audits and automated seller payout reconciliation.
- **Race Clock LED Wall PWA** | *TypeScript, Vite, WakeLock API* | [Live PWA](https://race-clock-ten.vercel.app/)  
  Real-time dual-screen timing app syncing director controls to stage LED walls under **5ms latency** via `localStorage` bus; deployed to live sporting heats.
- **MIS Operations Calendar** | *Supabase, PostgreSQL, Edge Functions* | [Live App](https://codexus-calendar.netlify.app)  
  Enterprise scheduling system with Supabase PostgreSQL and automated 07:30 daily cron dispatches (`pg_cron`) pushed directly to company Viber channels.
- **Langga Loan Tracker** | *React Native, Expo, Reanimated*  
  Mobile debt ledger app featuring 60 FPS Reanimated spring physics, intuitive amortization schedules, and zero-latency local state persistence.

---

## Education & Certifications

- **BS in Information Technology (BSIT)** — STI College General Santos *(2019 – 2024, DICT Scholar)*
- **Computer Systems Servicing NC II (CSS NC II)** — TESDA *(Certified 2024)*
- **SAP Business One Certification (SAP Basic)** — STI College *(Certified 2024)*
