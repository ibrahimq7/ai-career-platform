# AI Career Platform

AI Career Platform is a production-ready career intelligence SaaS for resume analysis, ATS scoring, skill recommendations, resume building, learning roadmaps, task tracking, interview preparation, and coding practice.

The product uses a hybrid resume intelligence architecture: deterministic parsing and ATS scoring happen locally first, then Gemini is used only for semantic enhancement, feedback, recommendations, and interview-style insights.

## Highlights

- Single-service production runtime: FastAPI serves both `/api/*` and the built React frontend.
- Supabase Magic Link authentication with Gmail-only access controls.
- Protected dashboard routes with persistent Supabase sessions.
- Row Level Security schemas for user-owned career data.
- Hybrid resume parser using regex, NLP utilities, PyMuPDF/DOCX extraction, and structured scoring logic.
- Algorithmic ATS score with explainable category breakdowns.
- Optional Gemini enhancement layer for recommendations and semantic feedback.
- Premium futuristic UI with glassmorphism, neon accents, animated dashboards, and responsive layouts.
- Resume builder with ATS-friendly templates inspired by top tech recruiting expectations.
- Task manager, learning hub, interview preparation, and coding practice modules.
- Docker-ready deployment for Render, Railway, Fly, or any container host.

## Screenshots

Add your screenshots to a folder like `docs/screenshots/`, then update these links.

| Dashboard | Resume Analyzer | Resume Builder |
| --- | --- | --- |
| `docs/screenshots/dashboard.png` | `docs/screenshots/resume-analyzer.png` | `docs/screenshots/resume-builder.png` |

| Auth | Learning Hub | Coding Practice |
| --- | --- | --- |
| `docs/screenshots/auth.png` | `docs/screenshots/learning.png` | `docs/screenshots/coding.png` |

## Tech Stack

Frontend:

- React + TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- React Router
- Supabase JS
- Chart.js
- React Ace

Backend:

- FastAPI
- Python
- Supabase Auth JWT validation
- PyMuPDF
- python-docx / docx2txt
- spaCy-compatible parser structure
- Gemini API enhancement layer

Infrastructure:

- Supabase PostgreSQL
- Supabase Auth
- Supabase Row Level Security
- Docker
- Single-process FastAPI static hosting

## Architecture

```text
User Browser
  |
  | React app served by FastAPI
  v
FastAPI
  |-- /api/health
  |-- /api/upload-resume/
  |-- Static React app from frontend/dist
  |
  |-- Supabase Auth JWT validation
  |-- Local resume extraction and ATS scoring
  |-- Optional Gemini semantic enhancement
  v
Supabase PostgreSQL + Auth + Storage
```

In production, you do not need to run frontend and backend separately. Build the frontend once, then FastAPI serves the entire product.

## Project Structure

```text
ai-career-platform/
  backend/
    project/resume_backend/
      app/resume_parser/
        main.py              # FastAPI app, API routes, static frontend serving
        auth.py              # Supabase JWT + Gmail-only validation
        parser_main.py       # Resume parsing entrypoint
        ats_engine.py        # Deterministic ATS scoring
        ai_enhancer.py       # Gemini enhancement layer
  frontend/
    src/
      components/            # Layout, auth, resume UI
      context/               # Auth and theme providers
      lib/                   # Supabase, API clients, utilities
      pages/                 # Product pages and protected routes
      index.css              # Premium UI theme and Tailwind styles
    dist/                    # Generated production build
  supabase/
    schema.sql               # PostgreSQL tables and RLS policies
  scripts/
    start.ps1                # One-command local production runner
  Dockerfile                 # Single-container production deployment
  DEPLOYMENT.md              # Deployment checklist
```

## Environment Variables

Create environment files from the examples:

```bash
cp frontend/.env.example frontend/.env
cp backend/project/resume_backend/.env.example backend/project/resume_backend/.env
```

Frontend:

```env
VITE_API_BASE_URL=
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-rotated-publishable-key
```

Leave `VITE_API_BASE_URL` blank for single-service production. The frontend will call same-origin `/api/*`.

Backend:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-rotated-publishable-key
GEMINI_API_KEY=your-rotated-gemini-key
GEMINI_MODEL=gemini-2.5-flash
ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
MAX_RESUME_UPLOAD_MB=10
```

Never commit real API keys. Rotate any key that has been pasted into chat, screenshots, or public files.

## Supabase Setup

1. Open Supabase SQL Editor.
2. Run `supabase/schema.sql`.
3. Enable Email OTP / Magic Link authentication.
4. Add these redirect URLs:

```text
http://localhost:8000/auth/callback
http://127.0.0.1:8000/auth/callback
https://your-production-domain.com/auth/callback
```

5. Configure the Supabase email OTP template to include both login options:

```text
Magic link: {{ .ConfirmationURL }}
OTP code: {{ .Token }}
```

6. Keep Row Level Security enabled.
7. Do not expose the Supabase service role key in the frontend.

## Run The Project

### Recommended Local Production Run

This builds the frontend and starts one FastAPI server that serves both frontend and backend:

```powershell
npm run start:single
```

Open:

```text
http://127.0.0.1:8000
```

Health check:

```text
http://127.0.0.1:8000/api/health
```

### Manual Single-Service Run

```bash
npm run build
uvicorn --app-dir backend/project/resume_backend app.resume_parser.main:app --host 0.0.0.0 --port 8000
```

### Development Mode

For fast frontend hot reload during development:

```bash
npm run dev:api
npm run dev:web
```

Vite proxies `/api` to FastAPI, so the code still uses the same API paths.

## Deployment

The cleanest deployment path is Docker:

```bash
docker build -t ai-career-platform .
docker run -p 8000:8000 --env-file .env ai-career-platform
```

For Render, Railway, Fly, or similar platforms, use the root `Dockerfile`.

Alternative build/start commands:

```bash
npm run build
pip install -r backend/project/resume_backend/requirements.txt
uvicorn --app-dir backend/project/resume_backend app.resume_parser.main:app --host 0.0.0.0 --port $PORT
```

See `DEPLOYMENT.md` for the deployment checklist.

## API Overview

Health:

```http
GET /api/health
```

Resume analysis:

```http
POST /api/upload-resume/
Authorization: Bearer <supabase_access_token>
Content-Type: multipart/form-data
```

Fields:

- `file`: PDF or DOCX resume
- `target_role`: target career role
- `use_ai`: `true` or `false`

## Security

- Supabase Auth handles identity and session persistence.
- Gmail-only access is validated on the frontend and backend.
- Email access uses a secure two-step flow: users receive a Supabase email and continue through either the magic link or 6-digit OTP code.
- Protected API routes require a valid Supabase JWT.
- User data access is controlled with Supabase RLS and `auth.uid()`.
- Resume uploads are size-limited.
- FastAPI adds security headers including CSP, frame protection, referrer policy, and content-type protection.
- Gemini receives structured extracted data, not raw PDF files.

## Verification

```bash
npm run build
python -m compileall backend/project/resume_backend/app
```

The latest verification passed for frontend build, backend compilation, and single-service serving of `/api/health` plus `/login`.

## Roadmap

- Supabase Storage persistence for uploaded resumes.
- Resume report history with downloadable PDFs.
- Advanced skill graph analytics.
- AI interview simulations with voice mode.
- Recruiter/admin dashboards.
- Coding execution sandbox integration.
- More ATS-safe resume templates.

## License

This project is private by default. Add a license before publishing publicly.
