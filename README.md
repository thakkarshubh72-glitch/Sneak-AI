# SneakAI — AI-Powered Sneaker Discovery Platform

A premium sneaker recommendation and shopping platform with AI-powered discovery, interactive 3D product visualization, and full e-commerce checkout.

## Architecture

```
├── frontend/          Next.js 14 (App Router) + TailwindCSS + Framer Motion + Three.js
├── backend/           Express.js REST API + MongoDB + JWT Auth
└── ai-service/        Python FastAPI + scikit-learn Recommendation Engine
```

## Quick Start

### 1. Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
# → http://localhost:3000
```

The frontend works standalone with built-in demo data. No backend required for basic browsing.

### 2. Backend (Express.js)

```bash
cd backend
npm install
cp .env.example .env   # Edit with your MongoDB URI and secrets
npm run dev
# → http://localhost:5000
```

**Requirements:** MongoDB running locally or MongoDB Atlas URI in `.env`

**Seed database:**
```bash
cd backend
node seed.js
```

### 3. AI Service (FastAPI)

```bash
cd ai-service
pip install -r requirements.txt
python main.py
# → http://localhost:8000
```

**Test recommendations:**
```bash
curl -X POST http://localhost:8000/api/recommend \
  -H "Content-Type: application/json" \
  -d '{"brands": ["Nike"], "styles": ["street"], "budget": 200}'
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, React, TailwindCSS, Framer Motion, Lenis, React Three Fiber |
| Backend | Node.js, Express.js, MongoDB/Mongoose, JWT |
| AI Engine | Python, FastAPI, scikit-learn (cosine similarity) |
| Payments | Stripe (demo checkout ready) |
| 3D | Three.js via React Three Fiber + Drei |

## Features

- **AI Recommendation Engine** — Content-based filtering with cosine similarity
- **Interactive 3D Viewer** — Rotate, zoom, change colors on sneaker models
- **Smooth Scrolling** — Lenis-powered ultra-smooth scroll experience
- **Premium Dark UI** — Glassmorphism, animations, gradient accents
- **Full E-commerce** — Cart, checkout, orders, user accounts
- **Mobile Responsive** — Touch-friendly, fully responsive design

## Environment Variables (Backend)

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT tokens |
| `STRIPE_SECRET_KEY` | Stripe API secret key |
| `PORT` | API server port (default: 5000) |
| `FRONTEND_URL` | Frontend URL for CORS |
| `AI_SERVICE_URL` | AI microservice URL |

## Deployment

### Frontend → Vercel
```bash
cd frontend
npx vercel
```

### Backend → Render / Railway
- Set environment variables in dashboard
- Set start command: `node server.js`

### AI Service → Render / Railway
- Set start command: `uvicorn main:app --host 0.0.0.0 --port 8000`

## Project Structure

```
frontend/
├── app/
│   ├── layout.js              Root layout
│   ├── page.js                Homepage
│   ├── globals.css            Global styles
│   ├── sneakers/
│   │   ├── page.js            Discovery grid
│   │   └── [id]/page.js       Product detail + 3D
│   ├── cart/page.js            Shopping cart
│   ├── checkout/page.js        Stripe checkout
│   ├── recommend/page.js       AI recommendations
│   ├── account/page.js         User account
│   └── auth/
│       ├── login/page.js       Login
│       └── register/page.js    Register
├── components/
│   ├── Navbar.jsx              Navigation
│   ├── Footer.jsx              Footer
│   ├── SneakerCard.jsx         Product card
│   ├── SneakerViewer3D.jsx     3D viewer
│   └── SmoothScroll.jsx        Lenis wrapper
├── lib/
│   └── cartStore.js            Zustand cart store
└── data/
    └── sneakers.js             Demo dataset (20 sneakers)

backend/
├── server.js                   Express entry
├── models/                     Mongoose schemas
├── routes/                     API routes
├── middleware/                 JWT auth
└── seed.js                     Database seeder

ai-service/
├── main.py                     FastAPI app
├── recommender.py              ML recommendation engine
└── data/sneakers.json         Training data
```
