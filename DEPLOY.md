# Vidya Chinthana (විද්‍යා චින්තන) - Deployment Guide

## Prerequisites

1. **Node.js** (v18+)
2. **PostgreSQL Database** (e.g., Supabase, Neon, or Railway)
3. **Google/GitHub/Apple OAuth Credentials**
4. **Vercel Account** (Recommended for hosting)

## Step 1: Database Setup

Vidya Chinthana uses Prisma with PostgreSQL for production.
1. Create a PostgreSQL database on Supabase.
2. Get your connection string (Session mode).
3. In `prisma/schema.prisma`, ensure the provider is set to `"postgresql"`.

## Step 2: Environment Variables

Configure your `.env` or Vercel Environment Variables:
```env
# Application URL
NEXT_PUBLIC_APP_URL=https://your-domain.com

# Database (PostgreSQL)
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres?pgbouncer=true"

# NextAuth Authentication
NEXTAUTH_SECRET="generate-a-strong-secret-key"
NEXTAUTH_URL="https://your-domain.com"

# Gemini API (for AI Summaries)
GEMINI_API_KEY="your-gemini-key"
```

## Step 3: Deployment (Vercel)

1. Push your code to a GitHub repository.
2. Go to [Vercel](https://vercel.com/) and Import the project.
3. In the Build & Development Settings, Vercel will automatically detect Next.js.
4. Add all environment variables from Step 2.
5. Click **Deploy**.

## Step 4: Initial Seeding (Super Admin)

Once deployed, you need an OWNER account to manage the newspaper.
Run the Prisma seed command against your production database from your local machine:
```bash
# Push schema to production DB
npx prisma db push

# Run the seed script to create the single Admin account
npx tsx prisma/seed.ts
```

Your initial login is:
- **Email:** Admin.Vidyachinthana.lk
- **Password:** admin123 (Please change this immediately in the Admin -> Settings/Users panel)

## Step 5: Security Hardening

The application includes:
- **Rate Limiting** on the login route to prevent brute-force attacks.
- **Strict Content Security Policy (CSP)** and standard security headers built into the Next.js configuration (`next.config.mjs`) and middleware.
- **Zod Schema Validations** for database inputs.
- **Hardcoded Single Owner Policy** enforced at the database level.
