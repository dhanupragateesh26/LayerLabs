# LayerLabs — 3D Printing Service

A modern, full-stack platform for custom FDM 3D printing and rapid prototyping. Customers can upload and preview `.stl` files in 3D, configure print parameters (material, infill, color, quantity), and submit quotes. The backend stores 3D files directly in MongoDB Atlas via GridFS (with automated 24-hour cleanup) and dispatches transactional confirmation emails via Resend.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 16 (App Router), React 19, TypeScript 5 |
| **Styling & UI** | Tailwind CSS v4, PostCSS, Lucide React |
| **Animations** | Framer Motion |
| **3D Rendering** | Three.js + STLLoader + OrbitControls |
| **Backend** | Node.js, Express 5 |
| **Database & Storage** | MongoDB Atlas + GridFS (Binary STL Object Storage) |
| **Email Delivery** | Resend API |
| **Hosting** | Vercel (Frontend) & Render (Backend) |

---

## 📁 Project Structure

```
LayerLabs/
├── frontend/                     # Next.js App Router Client
│   ├── public/                   # Static assets, product images, cursors
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx          # Landing page (Hero, Services, Products, Materials)
│   │   │   ├── layout.tsx        # Root layout, theme config, global navbar/footer
│   │   │   ├── globals.css       # Custom styling, Tailwind v4 design system
│   │   │   ├── order/            # 3D upload & order configuration page
│   │   │   ├── modelling/        # 3D Modelling service page
│   │   │   └── prototyping/      # Rapid Prototyping service page
│   │   ├── components/           # Navbar, ContactFooter, STLViewer, InteractiveBackground
│   │   └── data/                 # Modular product catalogue (products.ts)
│   ├── .env.example              # Template for frontend environment variables
│   └── package.json
├── backend/                      # Standalone Express REST API
│   ├── models/                   # Mongoose schemas (Order.js)
│   ├── server.js                 # Express server, GridFS streaming, email service, auto-cleanup
│   ├── .env.example              # Template for backend environment variables
│   └── package.json
└── render.yaml                   # Infrastructure-as-code Blueprint for Render
```

---

## 🚀 Local Development Setup

### 1. Backend

```bash
cd backend
cp .env.example .env          # Configure your environment variables
npm install
npm run dev                   # Starts server on http://localhost:5000
```

**Required `backend/.env` variables:**

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB Atlas connection string (`mongodb+srv://...`) |
| `ALLOWED_ORIGINS` | `http://localhost:3000` (comma-separated origins allowed for CORS) |
| `PORT` | Server port (default: `5000`) |
| `RESEND_API_KEY` | Resend API key for transactional emails (`re_...`) |

---

### 2. Frontend

```bash
cd frontend
cp .env.example .env.local    # Set API URL
npm install
npm run dev                   # Starts Next.js on http://localhost:3000
```

**Required `frontend/.env.local` variables:**

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:5000` (points to the backend API) |

---

## 🌐 Deployment Guide

### Backend Deployment (Render)
1. Link your GitHub repository to [Render](https://render.com).
2. Create a new **Web Service** or use the included `render.yaml` Blueprint.
3. Configure the Environment Variables in the Render dashboard:
   - `MONGODB_URI`
   - `ALLOWED_ORIGINS` → Your production frontend URL (e.g. `https://layerlabs.vercel.app`)
   - `RESEND_API_KEY`
   - `BACKEND_URL` → Your Render service URL (e.g. `https://layerlabs.onrender.com`)

### Frontend Deployment (Vercel)
1. Import your GitHub repository into [Vercel](https://vercel.com).
2. Set the **Root Directory** to `frontend`.
3. Add the environment variable:
   - `NEXT_PUBLIC_API_URL` = Your deployed Render backend URL (no trailing slash).
4. Deploy.

---

## ✨ Key Features

- **Interactive 3D STL Viewer** — Drag-and-drop `.stl` file uploads with orbit controls, mesh lighting, and real-time bounding volume & weight estimates.
- **Dynamic Product Catalogue** — Modular product system (`src/data/products.ts`) with expandable "See More / Show Less" showcase drawer.
- **Interactive Materials Deck** — Smooth fan-out animation revealing material properties and an intuitive "Find Your Material" comparison matrix.
- **Streamlined Order System** — Custom infill, material, and color specifications submitted with client-side validation.
- **Secure Cloud File Storage** — High-capacity `.stl` binary storage using MongoDB GridFS without consuming server disk space.
- **Automated Lifecycle & Cleanup** — 24-hour automated TTL job that deletes uploaded 3D files after order processing.
- **Instant Email Receipts** — Branded HTML confirmation emails with direct model download links via Resend.
- **Modern Stone Aesthetic** — Tailored light theme with smooth micro-animations, glassmorphism, and branded hover glows.

---

## 📄 License

This project is proprietary and maintained by LayerLabs. All rights reserved.
