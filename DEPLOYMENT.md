# AI Career Platform Deployment Checklist

Rotate every exposed Supabase/Gemini key before deployment.

This repo now supports a single-process production deployment: build the Vite frontend once, then FastAPI serves both `/api/*` and the React app.

## Environment

Frontend build-time variables:

```env
VITE_API_BASE_URL=
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-rotated-publishable-key
```

Backend runtime variables:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-rotated-publishable-key
GEMINI_API_KEY=your-rotated-gemini-key
GEMINI_MODEL=gemini-2.5-flash
GEMINI_TIMEOUT_SECONDS=25
GEMINI_RETRY_ATTEMPTS=2
ALLOWED_ORIGINS=https://your-production-domain.com
FRONTEND_DIST_DIR=/app/frontend/dist
MAX_RESUME_UPLOAD_MB=10
CONTENT_SECURITY_POLICY=
```

Do not expose `SUPABASE_SERVICE_ROLE_KEY` to the frontend. Add it only to backend runtime env if you later implement server-only admin/storage jobs.

## Supabase

1. Run `supabase/schema.sql` in the Supabase SQL editor.
2. Enable Email OTP / Magic Link.
3. Add `http://127.0.0.1:8000/auth/callback` and `https://your-production-domain.com/auth/callback` to Auth redirect URLs.
4. Configure the Supabase email OTP template to show both the magic link and the 6-digit token:

```text
Magic link: {{ .ConfirmationURL }}
OTP code: {{ .Token }}
```

5. Keep RLS enabled.
6. Never expose the service role key in frontend hosting.

## Single-Service Deployment

From the repository root:

```bash
npm run build
uvicorn --app-dir backend/project/resume_backend app.resume_parser.main:app --host 0.0.0.0 --port 8000
```

Health check:

```bash
curl https://your-production-domain.com/api/health
```

The API is available under `/api/*`. Browser routes such as `/login`, `/resume`, `/tasks`, and `/profile` are served by FastAPI from `frontend/dist`.

## Docker Deployment

Build and run one container:

```bash
docker build -t ai-career-platform .
docker run -p 8000:8000 --env-file .env ai-career-platform
```

## Render/Railway/Fly

Use the root `Dockerfile` for the cleanest deployment. If using build/start commands instead:

- Build command: `npm run build && pip install -r backend/project/resume_backend/requirements.txt`
- Start command: `uvicorn --app-dir backend/project/resume_backend app.resume_parser.main:app --host 0.0.0.0 --port $PORT`

## Local Verification

```bash
npm run verify
```

For local development with hot reload, run FastAPI on `8000` and Vite on `5173`; Vite proxies `/api` to FastAPI. For production testing, run `npm run build` and then `npm start` from the repo root.
