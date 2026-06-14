# Peyote Spychatelics — Free Deployment Guide

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│  Frontend (Next.js)        Backend (NestJS)              │
│  Vercel (Free)    ──────►  Railway / Render (Free)       │
│                            │                             │
│                            ▼                             │
│                   PostgreSQL (Neon.tech Free)            │
│                            │                             │
│                   Cloudinary (Free 25GB)                 │
└─────────────────────────────────────────────────────────┘
```

## Free Platforms Used

| Service     | Platform       | Free Tier Limits              |
|-------------|----------------|-------------------------------|
| Frontend    | Vercel         | Unlimited deploys, 100GB/mo   |
| Backend API | Railway        | $5 credit/mo (≈500hrs)        |
| Backend API | Render (alt)   | 750hrs/mo (spins down 15min)  |
| Database    | Neon.tech      | 512MB storage, 1 compute unit |
| Images      | Cloudinary     | 25GB storage, 25GB bandwidth  |
| Email       | Gmail SMTP     | 500 emails/day                |

---

## Step 1 — Set Up the Database (Neon.tech)

1. Go to **https://neon.tech** and create a free account
2. Click **New Project** → name it `peyote-spychatelics`
3. Select region closest to your users (e.g., `us-east-1`)
4. Copy the **Connection String** — looks like:
   ```
   postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require
   ```
5. Save this — you'll need it for both Railway/Render AND local dev

---

## Step 2 — Set Up Cloudinary (Image Storage)

1. Go to **https://cloudinary.com** → create free account
2. From your Dashboard, copy:
   - **Cloud Name**
   - **API Key**
   - **API Secret**
3. Create an upload preset:
   - Settings → Upload → Add upload preset
   - Name: `peyote_products`
   - Signing mode: **Signed**
   - Folder: `peyote-spychatelics`

---

## Step 3 — Enable Gmail SMTP

1. Go to **https://myaccount.google.com/security**
2. Enable **2-Step Verification**
3. Search for **"App passwords"** → create one for "Mail"
4. Copy the 16-character password (e.g., `abcd efgh ijkl mnop`)
5. Use `carlloy57@gmail.com` as SMTP user and this as SMTP pass

---

## Step 4 — Deploy Backend on Railway (Recommended)

Railway gives $5 free credit per month — enough for a small app.

### 4a. Install Railway CLI
```bash
npm install -g @railway/cli
railway login
```

### 4b. Deploy
```bash
cd peyote-spychatelics/backend
railway init
railway up
```

### 4c. Set Environment Variables on Railway Dashboard
Go to your project → Variables → Add all from `.env.example`:

```env
DATABASE_URL=postgresql://...neon.tech/neondb?sslmode=require
JWT_SECRET=change-this-to-a-long-random-string-32-chars-min
JWT_REFRESH_SECRET=another-long-random-string-32-chars-min
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
SMTP_USER=carlloy57@gmail.com
SMTP_PASS=your_gmail_app_password
FRONTEND_URL=https://your-app.vercel.app
NODE_ENV=production
PORT=4000
```

### 4d. Copy your Railway URL
After deploy, you'll get a URL like:
`https://peyote-api-production.up.railway.app`

---

## Step 4 (Alternative) — Deploy Backend on Render

Render is free but **spins down after 15 minutes of inactivity** (cold start ~30sec).

```bash
# Push your code to GitHub first
git add .
git commit -m "Initial deployment"
git push origin main
```

1. Go to **https://render.com** → New → Web Service
2. Connect your GitHub repo → select `backend/` directory
3. Set:
   - **Build Command:** `npm install && npx prisma generate && npm run build`
   - **Start Command:** `npx prisma migrate deploy && npm run start:prod`
4. Add all environment variables from `.env.example`
5. Click **Deploy**

---

## Step 5 — Deploy Frontend on Vercel

Vercel is the best free option for Next.js — built by the same team.

### 5a. Install Vercel CLI
```bash
npm install -g vercel
vercel login
```

### 5b. Deploy
```bash
cd peyote-spychatelics/frontend
vercel
```

### 5c. Set Environment Variables
In Vercel Dashboard → your project → Settings → Environment Variables:

```env
NEXT_PUBLIC_API_URL=https://peyote-api-production.up.railway.app/api/v1
NEXT_PUBLIC_WHATSAPP=+13202626158
NEXT_PUBLIC_EMAIL=carlloy57@gmail.com
```

### 5d. Redeploy with env vars
```bash
vercel --prod
```

Your frontend will be live at: `https://peyote-spychatelics.vercel.app`

---

## Step 6 — Run Database Migration & Seed

After the backend is deployed and `DATABASE_URL` is set:

```bash
cd backend

# If running locally against Neon DB:
npx prisma migrate deploy
npx ts-node prisma/seed.ts
```

Or via Railway CLI:
```bash
railway run npx prisma migrate deploy
railway run npx ts-node prisma/seed.ts
```

This creates:
- Admin account: `carlloy57@gmail.com` / `Admin@Peyote2024!` ← **Change this!**
- Product categories
- Sample products
- Contact settings

---

## Step 7 — Push to GitHub (for CI/CD)

Both Vercel and Railway/Render auto-deploy on every push to `main`.

```bash
# In project root
git init
git add .
git commit -m "🌵 Initial Peyote Spychatelics deployment"

# Create repo on github.com, then:
git remote add origin https://github.com/yourusername/peyote-spychatelics.git
git push -u origin main
```

After this, every `git push` automatically redeploys both frontend and backend.

---

## Local Development

### Prerequisites
- Node.js 18+
- PostgreSQL (or use Neon.tech connection string locally)

### Backend
```bash
cd backend
cp .env.example .env
# Fill in your DATABASE_URL and other values
npm install
npx prisma generate
npx prisma migrate dev --name init
npx ts-node prisma/seed.ts
npm run start:dev
# API running at http://localhost:4000
# Swagger docs at http://localhost:4000/api/docs
```

### Frontend
```bash
cd frontend
cp .env.example .env.local
# Set NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
npm install
npm run dev
# App running at http://localhost:3000
```

---

## Admin Dashboard Access

After deployment:
1. Navigate to `https://your-app.vercel.app/auth/login`
2. Login with: `carlloy57@gmail.com` / `Admin@Peyote2024!`
3. Go to `https://your-app.vercel.app/admin`

**Important:** Change the admin password immediately after first login!

---

## API Documentation

Swagger UI available at:
`https://your-api.railway.app/api/docs`

### Key Endpoints
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/auth/register` | Register customer |
| POST | `/api/v1/auth/login` | Login |
| GET | `/api/v1/products` | List products |
| GET | `/api/v1/products/:slug` | Product detail |
| POST | `/api/v1/orders` | Place order |
| GET | `/api/v1/orders/my` | My orders |
| GET | `/api/v1/customers` | Admin: list customers |
| GET | `/api/v1/contact/settings` | Contact info |

---

## Custom Domain (Optional, Free)

### Vercel Custom Domain
1. Vercel Dashboard → Project → Settings → Domains
2. Add your domain (e.g., `peyotespychatelics.com`)
3. Update DNS at your registrar to point to Vercel's servers

### Free Domain Options
- **Freenom:** `.tk`, `.ml`, `.ga` domains (free)
- **js.org:** Free subdomains for JS projects

---

## Monitoring & Uptime (Free)

- **UptimeRobot** (https://uptimerobot.com): Monitor your API and get email alerts — free for 50 monitors
- **Vercel Analytics**: Built-in, free tier available

---

## Cost Breakdown (Monthly)

| Service | Cost |
|---------|------|
| Vercel (Frontend) | $0 |
| Railway (Backend) | $0 (within $5 credit) |
| Neon.tech (Database) | $0 |
| Cloudinary (Images) | $0 |
| Gmail SMTP | $0 |
| **Total** | **$0/month** |

When you're ready to scale, upgrade Railway to ~$20/mo for a dedicated server.

---

## Troubleshooting

**Backend 502/503 error:**
- Check Railway logs: `railway logs`
- Verify `DATABASE_URL` is set correctly
- Ensure `prisma migrate deploy` ran successfully

**Images not uploading:**
- Verify Cloudinary credentials in env vars
- Check upload preset name matches `peyote_products`

**Cart not persisting:**
- Cart uses Redux state (in-memory) — implement localStorage persistence if needed

**CORS errors:**
- Set `FRONTEND_URL` in backend env to your exact Vercel URL (no trailing slash)
