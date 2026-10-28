# Jiggy B. Palconit
**Software Developer**  
General Santos City, Philippines | +63 992 913 1887 | jigspals025@gmail.com  
[GitHub: github.com/jiggy025](https://github.com/jiggy025) | [Live Portfolio: jiggy025.github.io](https://jiggy025.github.io)

---

## Professional Summary
Software developer with practical experience building modern backend services and maintaining production enterprise ERP systems. Proven capability engineering greenfield systems in **Spring Boot (Java 17)** that bridge into established **Java 7/8** enterprise backends with optimistic concurrency control and zero regressions. Highly disciplined in following established architecture patterns (such as `AutoCloseable` session lifecycles, background worker isolation off the Swing EDT, and query indexing). Experienced in local-first mobile engineering with **Flutter / SQLite** and real-time frontend systems in **TypeScript**.

---

## Technical Skills
- **Languages:** Java (7/8, 17, 21), Dart, TypeScript, JavaScript, SQL (MySQL, PostgreSQL, SQLite), HTML5, CSS3
- **Backend & ERP:** Spring Boot (Web, Security, Actuator), Java Swing, Hibernate / JDBC, JasperReports, Java RMI, RESTful APIs
- **Mobile & Frontend:** Flutter (BLoC architecture, SQLite, local-first), React Native (Expo, Reanimated), Vite, PWA, Supabase
- **Architecture & Practices:** Legacy Modernization, Concurrency Control (Optimistic `@Version`, Queue-Locking), Multi-Branch Synchronization, Git, GitHub Actions

---

## Professional Experience

### **Software Developer** | Viajero Motorcycles Inc.
*Feb 2026 – Present | General Santos City, Philippines*
- **JRF System Engineering:** Architected and developed the Job Request Form tracking workflow in **Spring Boot** and **Java 17**, connecting modern web architecture to legacy **Java 7/8** database records. Implemented guarded state transitions (`JobRules`), optimistic locking (`@Version`), and direct menu bar integration in Swing clients (`JobRequestLauncher`).
- **ERP Maintenance & Module Extension:** Maintained and enhanced established enterprise modules (Inventory, Accounting, Financing, Asset Management, POS). Maintained strict compliance with existing architecture patterns, including `AutoCloseable` session lifecycles and background worker thread separation off the Swing EDT.
- **Inventory Optimization & Demand Forecasting:** Built forecasting and ordering modules (`PnlOrdering`, `PnlDemandABC`, `PnlStockMonth`). Implemented algorithmic reorder point calculations (ROQ: `AMC × (ABC - SM)`), day-anchored windowing, and automated QR code generation for Asset Label Printing.
- **Cross-Branch Guards & Concurrency:** Implemented transaction locking and out-of-stock guard restrictions for multi-store transfers (`Viajero ↔ Jicjam`), eliminating database concurrency race conditions.
- **Inter-Module Accounting Bridge:** Engineered bidirectional `FACC ↔ ACC` bridge adapter with reusable transaction components, in-memory report caching (`HashMap`), and synchronized payroll queue locking.

### **Technical Support VA** | Prime Developments
*2024 – 2025 | Remote*
- Handled front-line technical support, interface troubleshooting, account synchronization issues, and operational data management across virtual environments.

### **IT Support (SPES Beneficiary)** | LGU General Santos City — ICTD
*2023 | General Santos City, Philippines*
- Diagnosed hardware, PC systems, and network peripherals; structured and tested LAN cabling and router configurations across local government offices.

### **Technical & Design Assistant** | DPI Print Solutions
*2018 – 2019 | General Santos City, Philippines*
- Prepared digital graphic layouts and web assets while diagnosing and troubleshooting commercial digital printing machinery and office computer systems.

---

## Key Projects & Systems

### **Rent-a-Box SQLite Ledger (Espasyo)**
*Flutter, Dart, SQLite, BLoC* | [GitHub Repository](https://github.com/jiggy025/rent-a-box-sys)
- Offline-first Flutter retail management APK for box rental hubs. Features real-time counter dashboards, vacancy audits, and automated seller payouts backed by local SQLite transactions.

### **Race Clock LED Wall PWA**
*TypeScript, Vite, WakeLock API, PWA* | [Live Deployment](https://race-clock-ten.vercel.app/)
- Real-time dual-screen timing application syncing race director controls with stage LED walls under 5ms latency via `localStorage` event bus and WakeLock API. Deployed to production for live sporting events.

### **MIS Calendar & Alerts**
*Supabase PostgreSQL, Edge Functions, pg_cron* | [Live Deployment](https://codexus-calendar.netlify.app)
- Enterprise operations calendar with Supabase PostgreSQL, automated daily 07:30 cron dispatches (`pg_cron`), and webhook notifications pushed automatically to company Viber channels.

### **Langga Loan Tracker**
*React Native, Expo, Reanimated*
- Mobile debt ledger app featuring 60 FPS Reanimated spring physics, intuitive amortization schedules, and zero-latency local state persistence.

---

## Education & Credentials

- **Bachelor of Science in Information Technology (BSIT)** — STI College General Santos (2019 – 2024) | *DICT Scholar*
- **Computer Systems Servicing NC II (CSS NC II)** — Technical Education and Skills Development Authority (TESDA, 2024)
- **SAP Business One Certification (SAP Basic)** — STI College (2024)
- **Secondary Education (TVL Track - ICT Major)** — Bula National School of Fisheries (2012 – 2018)
