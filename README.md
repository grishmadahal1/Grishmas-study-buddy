# Grishma's Study Buddy

A personal AI-powered flashcard app I built to make studying less painful. Paste your notes or upload a PDF, and it generates interactive flashcards with a study mode — plus an "Explain this" feature that gives deeper breakdowns of any card.

## What it does

- Paste text or drag-and-drop a PDF to generate flashcards via OpenAI
- Interactive card grid with 3D CSS flip animations
- Study mode with progress tracking and Got it / Try again scoring
- "Explain this" on any card — AI gives a detailed explanation with code examples, cached in the database so it's instant the second time
- Save and load sessions so you can pick up where you left off
- Warm, calm UI inspired by Apple's design — cream backgrounds, sage green accents, Inter + Newsreader fonts

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 19, Vite, Axios, plain CSS, react-markdown |
| Backend | Express 5, Node.js, OpenAI API (GPT-3.5 Turbo) |
| Database | PostgreSQL via [TypeORM](https://typeorm.io/) |
| File handling | Multer + pdf-parse for PDF uploads |
| Testing | Jest + Supertest (backend), Vitest + React Testing Library (frontend) |
| CI/CD | GitHub Actions — lint, test, build on every push/PR |
| Hosting | [Vercel](https://vercel.com) (frontend) + [Render](https://render.com) (backend) + [Neon](https://neon.tech) (database) |

## Architecture

```
GitHub (push to main/develop)
  ├── GitHub Actions → lint, test, build
  ├── Vercel auto-deploys frontend
  └── Render auto-deploys backend
                ↓
Frontend (Vercel) → Backend (Render) → PostgreSQL (Neon)
```

## Project Structure

```
├── backend/
│   ├── server.js                    # Entry point — initializes TypeORM, starts Express
│   ├── src/
│   │   ├── config/                  # Centralized config (env vars, defaults)
│   │   ├── database/                # TypeORM DataSource setup
│   │   ├── entities/                # TypeORM entity schemas (Session, Explanation)
│   │   ├── models/                  # Repository wrappers (SessionModel, ExplanationModel)
│   │   ├── services/                # Business logic (AI, Flashcard, Session, Explanation)
│   │   ├── controllers/             # Route handlers
│   │   ├── routes/                  # Express route definitions
│   │   ├── middleware/              # Error handler, Multer upload config
│   │   └── app.js                   # Express app setup (CORS, JSON, routes)
│   ├── __tests__/                   # Jest unit + integration tests
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/              # InputSection, FlashcardDeck, StudyMode, SessionList, ExplainModal
│   │   ├── hooks/                   # useFlashcards custom hook
│   │   ├── services/                # Axios API client
│   │   ├── __tests__/               # Vitest + RTL component tests
│   │   ├── App.jsx
│   │   └── index.css
│   ├── Dockerfile
│   └── nginx.conf
├── docker-compose.yml               # Local dev: Postgres + backend + frontend
└── .github/workflows/ci.yml         # CI pipeline
```

## Local Setup

### Prerequisites

- Node.js 22+
- Docker (for local PostgreSQL)
- An [OpenAI API key](https://platform.openai.com/api-keys)

### 1. Clone and install

```bash
git clone https://github.com/grishmadahal1/Grishmas-study-buddy.git
cd Grishmas-study-buddy
cd backend && npm install
cd ../frontend && npm install
```

### 2. Configure environment

```bash
# backend/.env
OPENAI_API_KEY=sk-your-key-here
PORT=5001
DATABASE_URL=postgres://flashcards:flashcards@localhost:5432/flashcards
```

```bash
# frontend/.env
VITE_API_URL=http://localhost:5001
```

### 3. Start Postgres + backend + frontend

```bash
# Start local Postgres
docker compose up postgres -d

# Start backend (in one terminal)
cd backend && npm start

# Start frontend (in another terminal)
cd frontend && npm run dev
```

The app runs on `http://localhost:5173` with the API on `http://localhost:5001`.

### Running tests

```bash
cd backend && npm test       # Jest — 29 unit + integration tests
cd frontend && npm test      # Vitest — 17 component tests
```

## Deployment Decisions

Here's why I picked each platform — all have generous free tiers:

### Database — [Neon](https://neon.tech)

Free serverless PostgreSQL with 0.5 GB storage. I migrated from SQLite because most hosting platforms use ephemeral filesystems — your data would get wiped on every deploy. Neon gives you a real Postgres instance with a connection string, no infrastructure to manage.

1. Sign up at [neon.tech](https://neon.tech)
2. Create a project → copy the connection string
3. Use it as `DATABASE_URL` on Render

### Backend — [Render](https://render.com)

Free web service tier with auto-deploy from GitHub. Supports Node.js out of the box.

1. [Create a new Web Service](https://dashboard.render.com/web/new) → connect your GitHub repo
2. **Root Directory:** `backend`
3. **Build Command:** `npm ci`
4. **Start Command:** `node server.js`
5. **Environment Variables:**
   - `DATABASE_URL` = your Neon connection string
   - `OPENAI_API_KEY` = your key
   - `PORT` = `5001`
   - `CORS_ORIGIN` = your Vercel URL (set after frontend deploy)

### Frontend — [Vercel](https://vercel.com)

Best free hosting for Vite/React — global CDN, instant deploys, zero config.

1. [Import your repo](https://vercel.com/new) on Vercel
2. **Root Directory:** `frontend`
3. **Framework Preset:** Vite
4. **Environment Variable:** `VITE_API_URL` = your Render backend URL (e.g. `https://your-app.onrender.com`)

### After both are deployed

Go back to Render and set `CORS_ORIGIN` to your Vercel URL (e.g. `https://your-app.vercel.app`) so the backend only accepts requests from your frontend.

### CI/CD — [GitHub Actions](https://docs.github.com/en/actions)

Runs automatically on every push to `main`/`develop` and on pull requests:
- **Backend:** lint (ESLint) + test (Jest)
- **Frontend:** test (Vitest) + build (Vite)

No manual deployment needed — Vercel and Render both auto-deploy when you push to the main branch.

## Docker (local dev)

To run everything in containers:

```bash
docker compose up --build
```

This starts Postgres, backend (port 5001), and frontend (port 3000).
