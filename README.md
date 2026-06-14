# 🌵 Peyote Spychatelics — Full-Stack E-Commerce Platform

A premium botanical marketplace built with Next.js, NestJS, PostgreSQL, and Cloudinary.

## Free Deployment Stack

| Service | Platform | Free Tier |
|---------|----------|-----------|
| Frontend | **Vercel** | Unlimited deployments |
| Backend API | **Render** | 750 hrs/month |
| Database | **Supabase** | 500MB PostgreSQL |
| Images | **Cloudinary** | 25GB storage |
| Email | **Resend** | 3,000 emails/month |

---

## Quick Start

### 1. Clone & Install

```bash
# Frontend
cd frontend && npm install

# Backend
cd backend && npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env` in both `frontend/` and `backend/` and fill in values.

### 3. Database Setup

```bash
cd backend
npx prisma generate
npx prisma migrate deploy
npx prisma db seed
```

### 4. Run Locally

```bash
# Backend (port 3001)
cd backend && npm run start:dev

# Frontend (port 3000)
cd frontend && npm run dev
```

---

## Deploy to Free Platforms

### Backend → Render

1. Push code to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your repo, select `backend/` as root
4. Build command: `npm install && npx prisma generate && npx prisma migrate deploy && npm run build`
5. Start command: `npm run start:prod`
6. Add environment variables from `backend/.env.example`

### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) → New Project
2. Connect your GitHub repo, select `frontend/` as root
3. Add environment variable: `NEXT_PUBLIC_API_URL=https://your-render-app.onrender.com`
4. Deploy — Vercel auto-detects Next.js

### Database → Supabase

1. Go to [supabase.com](https://supabase.com) → New Project
2. Copy the **Connection String** (URI format)
3. Set as `DATABASE_URL` in Render environment variables
4. Run migrations via Render shell or locally with the Supabase URL

### Images → Cloudinary

1. Go to [cloudinary.com](https://cloudinary.com) → Create account
2. Copy Cloud Name, API Key, API Secret
3. Add to backend environment variables

---

## Project Structure

```
peyote-spychatelics/
├── frontend/          # Next.js 14 App Router
│   ├── src/
│   │   ├── app/       # Pages & layouts
│   │   ├── components/# React components
│   │   ├── store/     # Redux Toolkit
│   │   └── lib/       # API client & utilities
│   └── package.json
├── backend/           # NestJS API
│   ├── src/
│   │   ├── auth/      # JWT authentication
│   │   ├── products/  # Product CRUD
│   │   ├── orders/    # Order management
│   │   ├── customers/ # Customer management
│   │   └── upload/    # Cloudinary uploads
│   ├── prisma/
│   │   └── schema.prisma
│   └── package.json
└── docs/              # API & deployment docs
```

---

## Admin Access

After seeding, login at `/admin` with:
- Email: `admin@peyotespychatelics.com`
- Password: `Admin@2024!`

**Change these immediately after first login.**

---

## Contact Configuration

- WhatsApp: +1 (320) 262-6158
- Email: carlloy57@gmail.com

Both configurable from the Admin → Contact Settings panel.
