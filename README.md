# FlashGen — AI Flashcard Generator

Generate study flashcards from any text or PDF using OpenAI. Paste your notes, upload a document, and get a beautiful deck of interactive flashcards with a built-in study mode.

## Tech Stack

**Frontend:** React 19, Vite, Axios, plain CSS with glassmorphism design
**Backend:** Express 5, OpenAI API (GPT-3.5 Turbo), Multer, pdf-parse
**Fonts:** Syne (headings) + DM Sans (body) via Google Fonts

## Features

- Paste text or drag-and-drop a PDF to generate flashcards
- Responsive card grid with CSS 3D flip animations
- Study mode with progress tracking and scoring
- Skeleton loading states and error handling
- Dark theme with glassmorphism UI
- Fully mobile responsive

## Setup

### Prerequisites

- Node.js 18+
- An OpenAI API key

### 1. Clone the repo

```bash
git clone <your-repo-url>
cd flashcard-app
```

### 2. Configure the backend

```bash
cd backend
cp .env.example .env
```

Open `backend/.env` and add your OpenAI API key:

```
OPENAI_API_KEY=sk-your-key-here
PORT=5000
```

### 3. Get an OpenAI API key

1. Go to [platform.openai.com](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to **API Keys** in the sidebar
4. Click **Create new secret key**
5. Copy the key and paste it into `backend/.env`

### 4. Start the backend

```bash
cd backend
node server.js
```

The API runs on `http://localhost:5000`.

### 5. Start the frontend

```bash
cd frontend
npm run dev
```

The app runs on `http://localhost:5173`.

## Project Structure

```
flashcard-app/
├── backend/
│   ├── server.js              # Express server setup
│   ├── routes/
│   │   ├── generate.js        # POST /api/generate — text to flashcards
│   │   └── upload.js          # POST /api/upload — PDF to flashcards
│   ├── lib/
│   │   └── openai.js          # Shared OpenAI generation logic
│   └── .env                   # API key and port
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── InputSection.jsx/.css
│   │   │   ├── FlashcardDeck.jsx/.css
│   │   │   └── StudyMode.jsx/.css
│   │   ├── hooks/
│   │   │   ├── useFlashcards.js
│   │   │   └── useStudySession.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx/.css
│   │   ├── index.css
│   │   └── main.jsx
│   └── .env                   # VITE_API_URL
└── README.md
```

## Deployment

### Frontend — Vercel

1. Push your repo to GitHub
2. Go to [vercel.com](https://vercel.com/) and import the repo
3. Set the **Root Directory** to `frontend`
4. Add environment variable: `VITE_API_URL` = your deployed backend URL
5. Deploy

### Backend — Render

1. Go to [render.com](https://render.com/) and create a new **Web Service**
2. Connect your repo and set the **Root Directory** to `backend`
3. Set the **Build Command** to `npm install`
4. Set the **Start Command** to `node server.js`
5. Add environment variables: `OPENAI_API_KEY` and `PORT=5000`
6. Deploy

After deploying the backend, update `VITE_API_URL` in your Vercel environment variables to point to the Render URL.
