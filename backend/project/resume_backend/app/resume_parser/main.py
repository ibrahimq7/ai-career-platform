import os
from pathlib import Path

from .ats_engine import build_resume_intelligence
from .auth import get_required_gmail_user
from .ai_enhancer import enhance_with_gemini
from .parser_main import parse_resume

from fastapi import Depends, FastAPI, File, Form, HTTPException, Request, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

app = FastAPI(title="AI Career Platform")

PROJECT_ROOT = Path(__file__).resolve().parents[5]
FRONTEND_DIST_DIR = Path(os.getenv("FRONTEND_DIST_DIR", PROJECT_ROOT / "frontend" / "dist")).resolve()
FRONTEND_INDEX = FRONTEND_DIST_DIR / "index.html"
MAX_RESUME_UPLOAD_MB = int(os.getenv("MAX_RESUME_UPLOAD_MB", "10"))
MAX_RESUME_UPLOAD_BYTES = MAX_RESUME_UPLOAD_MB * 1024 * 1024
DEFAULT_CSP = (
    "default-src 'self'; "
    "script-src 'self'; "
    "style-src 'self' 'unsafe-inline'; "
    "img-src 'self' data: blob: https:; "
    "font-src 'self' data:; "
    "connect-src 'self' https://*.supabase.co https://generativelanguage.googleapis.com; "
    "frame-ancestors 'none'; "
    "base-uri 'self'; "
    "form-action 'self'"
)

allowed_origins = [
    origin.strip()
    for origin in os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173").split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers.setdefault("X-Content-Type-Options", "nosniff")
    response.headers.setdefault("X-Frame-Options", "DENY")
    response.headers.setdefault("Referrer-Policy", "strict-origin-when-cross-origin")
    response.headers.setdefault("Permissions-Policy", "camera=(), microphone=(), geolocation=()")
    response.headers.setdefault("Content-Security-Policy", os.getenv("CONTENT_SECURITY_POLICY", DEFAULT_CSP))

    if request.url.scheme == "https":
        response.headers.setdefault("Strict-Transport-Security", "max-age=31536000; includeSubDomains")

    return response


@app.get("/health")
@app.get("/api/health")
async def health():
    return {
        "status": "ok",
        "frontend": "ready" if FRONTEND_INDEX.exists() else "not_built",
    }


@app.post("/upload-resume/")
@app.post("/api/upload-resume/")
async def upload_resume(
    file: UploadFile = File(...),
    target_role: str = Form("full stack developer"),
    use_ai: bool = Form(True),
    user: dict = Depends(get_required_gmail_user),
):
    filename = file.filename or ""
    if not filename.lower().endswith((".pdf", ".docx")):
        raise HTTPException(status_code=400, detail="Only PDF and DOCX resumes are supported.")

    contents = await file.read()
    if not contents:
        raise HTTPException(status_code=400, detail="Uploaded resume is empty.")
    if len(contents) > MAX_RESUME_UPLOAD_BYTES:
        raise HTTPException(status_code=413, detail=f"Resume must be {MAX_RESUME_UPLOAD_MB}MB or smaller.")

    try:
        parsed = parse_resume(filename, contents)
        analysis = build_resume_intelligence(parsed, target_role)
        analysis["user_id"] = user.get("id")
        analysis["ai_enhancement"] = enhance_with_gemini(analysis) if use_ai else {
            "enabled": False,
            "reason": "AI enhancement was disabled for this request.",
            "summary": "",
            "ats_explanation": "",
            "job_eligibility": "ATS-only analysis",
            "eligibility_score": analysis["ats_score"],
            "eligibility_reason": "AI enhancement was disabled, so eligibility is based on deterministic ATS scoring only.",
            "priority_actions": [],
            "dream_job_fit": "",
            "skill_gap_analysis": [],
            "career_roadmap": [],
            "achievement_feedback": [],
            "project_recommendations": [],
            "interview_questions": [],
            "model": None,
        }
        return analysis
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Resume analysis failed: {exc}") from exc


app.mount(
    "/assets",
    StaticFiles(directory=str(FRONTEND_DIST_DIR / "assets"), check_dir=False),
    name="frontend-assets",
)


@app.get("/", include_in_schema=False)
async def serve_frontend():
    if FRONTEND_INDEX.exists():
        return FileResponse(FRONTEND_INDEX)
    return {
        "service": "AI Career Platform API",
        "status": "frontend build not found",
        "hint": "Run `npm run build` in frontend/ before starting a single-process production server.",
    }


@app.get("/{full_path:path}", include_in_schema=False)
async def serve_spa_or_static_file(full_path: str):
    reserved_prefixes = ("api/", "docs", "redoc", "openapi.json", "health")
    if full_path.startswith(reserved_prefixes):
        raise HTTPException(status_code=404, detail="Not found")

    requested_file = (FRONTEND_DIST_DIR / full_path).resolve()
    if requested_file.is_file() and FRONTEND_DIST_DIR in requested_file.parents:
        return FileResponse(requested_file)

    if FRONTEND_INDEX.exists():
        return FileResponse(FRONTEND_INDEX)

    raise HTTPException(status_code=404, detail="Frontend build not found")


# from fastapi import FastAPI, UploadFile, File
# from parser import parse_resume

# app = FastAPI()

# @app.post("/upload_resume/")
# async def upload_resume(file: UploadFile = File(...)):
#     content = await file.read()
#     parsed_data = parse_resume(file.filename, content)
#     return parsed_data
