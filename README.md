# 🌌 Vidya Chinthana (විද්‍යා චින්තන)
> **Digital Science, Technology & Speculative Philosophy Magazine Platform**

Vidya Chinthana is a world-class, production-ready digital publication system built on **Next.js 15 (App Router)**, **TypeScript**, **Prisma ORM**, **Tailwind CSS**, and **TipTap Rich Text Engine**.

---

## 🌟 Key Features

- **Liquid Glass & Sci-Fi Aesthetic**: Dynamically morphing ambient background, liquid glass surfaces, and responsive navigation island with Light (pure, editorial white) and Dark (deep sci-fi neon) themes.
- **Executive Command Center (`/admin`)**:
  - **Recharts Analytics Dashboard**: Daily active readers, reading duration telemetry, and archival discipline breakdowns.
  - **Role-Based Access Control (RBAC)**:
    - `OWNER`: Full system control, role permissions, global branding settings, and instant cache purging.
    - `EDITOR`: Manuscript review & approval, 3D flipbook issue curation.
    - `AUTHOR`: Manuscript draft studio and personal citation stats.
- **Bilingual TipTap Editorial Suite**: Integrated AI outline generator, bilingual synchronization (English & Sinhala), rich typography, and Cloud image uploads.
- **3D Interactive Flipbook Folios**: Reader engine for full magazine issues with animated page turns and high-density rendering.
- **Sub-Second Search & Taxonomy**: Instant filter across Quantum Physics, Cognitive AI, Biosphere Research, and Hard Sci-Fi speculation.
- **Performance & SEO**: ISR (`revalidate: 60`), OpenGraph metadata generators, font optimization with `next/font/google`, and responsive image delivery.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, Turbopack, React 19)
- **Database ORM**: [Prisma](https://www.prisma.io/) (PostgreSQL in production / SQLite for rapid dev)
- **Auth**: [NextAuth.js](https://next-auth.js.org/) with session management and role guards
- **Charts & Telemetry**: [Recharts](https://recharts.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Storage**: Firebase Cloud Storage for media assets

---

## 🚀 Quick Start (Local Development)

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 3. Initialize & Seed Database
```bash
npx prisma db push
npx tsx prisma/seed.ts
```

### 4. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
vidya-chinthana-nextjs/
├── src/
│   ├── app/                 # Next.js 15 App Router pages & API routes
│   │   ├── admin/           # Executive Command Center, Users & Settings
│   │   ├── api/             # RESTful API endpoints & Auth handlers
│   │   ├── articles/        # Transmissions index & single article reader (ISR)
│   │   ├── authors/         # Faculty fellows directory
│   │   ├── issues/          # 3D Flipbook magazine folios
│   │   └── search/          # Multi-field taxonomy search
│   ├── components/          # Reusable UI, Liquid Navigation & Flipbook
│   ├── lib/                 # Prisma, Firebase Storage, Auth helpers
│   └── providers/           # ThemeProvider, SessionProvider
├── prisma/
│   ├── schema.prisma        # Database schema (Articles, Users, SiteConfig, Issues)
│   └── seed.ts              # Production-grade seed data
└── DEPLOY.md                # Multi-cloud deployment handbook
```

---

## 📄 License & Ownership

The entire Vidya Chinthana codebase is 100% independent, portable, and cloud-provider agnostic.
