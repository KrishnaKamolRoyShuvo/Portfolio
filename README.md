# Krishna Kamol Roy Shuvo — Engineering Portfolio

Interactive software engineering portfolio featuring production enterprise systems, 3D WebGL ambient visualization, interactive fluid water physics, and published machine learning research.

- **Live URL:** [https://KrishnaKamolRoyShuvo.github.io/portfolio](https://KrishnaKamolRoyShuvo.github.io/portfolio)
- **Primary Tech Stack:** JavaScript (ES6+), Vite, Tailwind CSS, GSAP, Lenis, Three.js, Lucide
- **Deployed Backend Systems:** ASP.NET Core MVC, React, Node.js, Neon Serverless PostgreSQL

---

## Quick Start & Local Development

Clone the repository and install dependencies:

```bash
git clone https://github.com/KrishnaKamolRoyShuvo/portfolio.git
cd portfolio
npm install
```

Start the local development server:

```bash
npm run dev
```

Build production bundle:

```bash
npm run build
npm run preview
```

---

## Featured Flagship Systems

### 1. MicroShift (Part-Time Job Portal & Escrow Service)
* **Live App:** [https://microshift.onrender.com](https://microshift.onrender.com)
* **Pre-Seeded Admin:** `admin112@microshift.com` / `Pass@1234`
* **Stack:** ASP.NET Core MVC, C#, Entity Framework Core, Neon Serverless PostgreSQL, Stripe Escrow, SignalR WebSockets, Leaflet.js, EXIF Forensic Analysis.

### 2. School Management & Admission System
* **Frontend Portal:** [https://school-admission-6bz8.onrender.com](https://school-admission-6bz8.onrender.com)
* **Admin Portal:** [https://school-admission-6bz8.onrender.com/admin](https://school-admission-6bz8.onrender.com/admin)
* **Backend API:** [https://school-management-system-r060.onrender.com](https://school-management-system-r060.onrender.com)
* **Stack:** React.js, Node.js, Express REST API, Neon Serverless PostgreSQL (`neondb`), JWT Authentication.

### 3. Smart Car Parking Management Platform
* **Stack:** MongoDB, Express.js, React.js, Node.js (MERN), Dynamic Surge Pricing Algorithm.

---

## Research & Academic Publications

* **Springer Nature (ICACCP 2025):** *Advanced Fake News Detection: A Benchmark Study Using Machine Learning, Deep Learning and Ensemble Methods* (3rd Author, Pages 396–406, DOI: [10.1007/978-3-032-13555-1_34](https://doi.org/10.1007/978-3-032-13555-1_34))
* **Undergraduate Thesis (IUBAT):** *Bangla Sign Language Detection with Machine Learning Multi-Modal Approach* (Vision Transformer & CNN-LSTM late fusion).

---

## Interactive Features

* **Inertial Momentum Scrolling:** Powered by Lenis for buttery-smooth 60–120 FPS navigation.
* **Fluid Water Ripple Engine:** Canvas-based 2D wave equations reacting organically to cursor velocity and pointer clicks.
* **Ambient 3D Particle Mesh:** Three.js interactive constellation reacting to cursor position and viewport tilt.
* **Adaptive Theme Engine:** High-contrast Dark Mode (deep obsidian) & Day Mode (architectural titanium).
* **Interactive CLI Terminal:** Functional terminal console executing commands (`help`, `about`, `skills`, `projects`, `contact`, `hire`).
* **Direct Contact Hub:** 1-click clipboard copy for email & phone, direct WhatsApp chat, and downloadable vCard (.vcf).

---

## Deployment to GitHub Pages

This project is configured for automated CI/CD deployment via GitHub Actions:

1. Push changes to the `main` branch.
2. In your GitHub repository, navigate to **Settings > Pages**.
3. Under **Build and deployment > Source**, select **GitHub Actions**.
4. The `.github/workflows/deploy.yml` workflow will automatically build and deploy the production bundle to `https://KrishnaKamolRoyShuvo.github.io/portfolio`.
