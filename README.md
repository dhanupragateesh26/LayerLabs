# LayerLabs — 3D Printing Service

A full-stack platform for custom FDM 3D printing. Customers upload an STL file, configure their print, and submit an order. The backend sends an automatic confirmation email and stores the file securely in MongoDB GridFS with a 24-hour auto-cleanup.

---

## Tech Stack

| Layer     | Technology |
|-----------|-----------|
| Frontend  | Next.js 15 (App Router), TypeScript, Tailwind CSS v4 |
| 3D Viewer | Three.js + STLLoader + OrbitControls |
| Backend   | Node.js / Express 5 |
| Database  | MongoDB Atlas + GridFS (STL file storage) |
| Email     | Nodemailer (Gmail App Password) |
| Frontend hosting | Vercel |
| Backend hosting  | Render |

---

## Project Structure

```
LayerLabs/
├── frontend/          # Next.js app
│   ├── src/
│   │   ├── app/       # Pages (/, /order)
│   │   └── components/# Navbar, Footer, STLViewer, Background
│   ├── .env.example   # Copy → .env.local for local dev
│   └── next.config.ts
├── backend/           # Express API
│   ├── models/        # Mongoose schemas
│   ├── server.js      # Main server (GridFS, email, cleanup job)
│   └── .env.example   # Copy → .env for local dev
└── render.yaml        # One-click Render deployment
```

---

## Local Development

### 1 — Backend

```bash
cd backend
cp .env.example .env        # fill in your values
npm install
npm run dev                 # nodemon, port 5000
```

**Required `.env` values:**

| Key | Description |
|-----|-------------|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `ALLOWED_ORIGINS` | `http://localhost:3000` for local dev |
| `EMAIL_USER` | Gmail address for sending confirmations |
| `EMAIL_PASS` | Gmail **App Password** (not your regular password) |

> **Gmail App Password:** Google Account → Security → 2-Step Verification → App Passwords

### 2 — Frontend

```bash
cd frontend
cp .env.example .env.local  # fill in backend URL
npm install
npm run dev                 # Next.js, port 3000
```

**Required `.env.local` value:**

| Key | Description |
|-----|-------------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:5000` for local dev |

---

## Deployment

### Backend → Render

1. Push this repo to GitHub.
2. Go to [render.com](https://render.com) → **New → Blueprint** → select your repo.
3. Render reads `render.yaml` automatically.
4. In the Render dashboard, set the four **secret** env vars manually:
   - `MONGODB_URI`
   - `ALLOWED_ORIGINS` → your Vercel URL, e.g. `https://layerlabs.vercel.app`
   - `EMAIL_USER`
   - `EMAIL_PASS`
5. Deploy. Note your backend URL (e.g. `https://layerlabs-backend.onrender.com`).

### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project** → import your repo.
2. Set **Root Directory** to `frontend`.
3. Add this Environment Variable in Vercel:
   - `NEXT_PUBLIC_API_URL` = your Render backend URL (no trailing slash)
4. Deploy.

---

## Features

- **3D STL Viewer** — drag-and-drop upload with real-time Three.js preview
- **Model Colour Picker** — 8 colour swatches to preview your print colour
- **Smart Weight Estimate** — calculates solid-100% weight × quantity in-browser
- **Order Form** — material, infill density & pattern, quantity, delivery address
- **Email Confirmation** — automatic order receipt email to customer + BCC to owner
- **GridFS Storage** — STL files stored in MongoDB Atlas, never on disk
- **24h Auto-Cleanup** — hourly cron job deletes STL files older than 24 hours
- **Mobile-Responsive** — collapsible navbar, responsive grid layouts
- **Anchor Navigation** — smooth-scroll between landing page sections

---

## Notes

- The free Render plan spins down after 15 min of inactivity — the first request may be slow (~30 s).
- The weight estimate assumes 100% infill; actual print weight will be lower depending on infill density.
- STL files are stored only for 24 hours so the team can download and process them.
