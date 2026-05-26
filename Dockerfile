FROM node:20-slim AS frontend-builder

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend ./
RUN npm run build

FROM python:3.11-slim AS runtime

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV FRONTEND_DIST_DIR=/app/frontend/dist

WORKDIR /app

COPY backend/project/resume_backend/requirements.txt ./backend/project/resume_backend/requirements.txt
RUN pip install --no-cache-dir -r backend/project/resume_backend/requirements.txt

COPY backend ./backend
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

EXPOSE 8000

CMD ["sh", "-c", "uvicorn --app-dir backend/project/resume_backend app.resume_parser.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
