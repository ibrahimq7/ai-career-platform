import re
from typing import Any


PROJECT_SECTION_KEYS = {
    "project",
    "projects",
    "projectdetails",
    "projectsummary",
    "personalprojects",
    "academicprojects",
    "keyprojects",
    "majorprojects",
    "projectexperience",
    "projectsandexperience",
    "notableprojects",
    "selectedprojects",
    "selectedwork",
    "relevantprojects",
    "projectwork",
    "portfolio",
    "casestudies",
}

STOP_SECTION_HEADERS = {
    "education",
    "experience",
    "workexperience",
    "professionalexperience",
    "employmenthistory",
    "skills",
    "technicalskills",
    "certifications",
    "achievements",
    "awards",
    "publications",
    "extracurricular",
    "activities",
    "interests",
    "languages",
    "references",
}

IGNORE_LINES = {
    "sample resume",
    "curriculum vitae",
    "resume",
    "cv",
    "profile",
    "page",
    "contact",
    "summary",
}

DETAIL_LABELS = {
    "github",
    "gitlab",
    "bitbucket",
    "link",
    "links",
    "demo",
    "live",
    "source",
    "sourcecode",
    "repository",
    "repo",
    "code",
    "technologies",
    "technology",
    "techstack",
    "tools",
}

BULLET_RE = re.compile(r"^\s*(?:[-*•·▪–—]|\d+[.)])\s*")
PROJECT_DELIMITER_RE = re.compile(r"\s+(?:[-–—|])\s+|:\s+")
DATE_RE = re.compile(
    r"((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}\s*(?:-|–|—|to)\s*(?:Present|\d{4})|"
    r"\d{4}\s*(?:-|–|—|to)\s*(?:Present|\d{4})|"
    r"(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}|"
    r"\b(?:19|20)\d{2}\b)",
    re.IGNORECASE,
)
LINK_RE = re.compile(r"(https?://\S+|github\.com/\S+|gitlab\.com/\S+|bitbucket\.org/\S+)", re.IGNORECASE)
TECH_HINT_RE = re.compile(
    r"\b(react|next\.?js|node\.?js|express|django|fastapi|python|java|spring|typescript|javascript|"
    r"postgresql|mysql|mongodb|firebase|supabase|aws|azure|docker|kubernetes|tailwind|redux|api|"
    r"machine learning|tensorflow|pytorch|pandas|numpy|sql|html|css|flask|streamlit|power bi|tableau)\b",
    re.IGNORECASE,
)
ACTION_RE = re.compile(
    r"\b(built|developed|created|implemented|designed|deployed|integrated|automated|optimized|trained|analyzed)\b",
    re.IGNORECASE,
)


def extract_projects(sections: dict[str, str], raw_text: str = "") -> list[dict[str, Any]]:
    projects_text = find_project_section_text(sections)
    if not projects_text and raw_text:
        projects_text = extract_project_text_from_raw(raw_text)

    projects = parse_project_entries(projects_text) if projects_text.strip() else []
    if not projects and raw_text:
        projects = extract_project_candidates_from_full_text(raw_text)

    return dedupe_projects(projects)[:10]


def find_project_section_text(sections: dict[str, str]) -> str:
    chunks = []
    for key, value in sections.items():
        if normalize_key(key) in PROJECT_SECTION_KEYS and value and value.strip():
            chunks.append(value)
    return "\n".join(chunks).strip()


def extract_project_text_from_raw(raw_text: str) -> str:
    lines = normalize_project_lines(raw_text)
    capture = False
    captured: list[str] = []

    for line in lines:
        key = normalize_key(strip_heading_marks(line))
        if key in PROJECT_SECTION_KEYS:
            capture = True
            continue

        if capture and key in STOP_SECTION_HEADERS and looks_like_section_heading(line):
            break

        if capture:
            captured.append(line)

    return "\n".join(captured).strip()


def parse_project_entries(projects_text: str) -> list[dict[str, Any]]:
    lines = normalize_project_lines(projects_text)
    entries: list[dict[str, Any]] = []
    current_name = ""
    current_desc: list[str] = []

    for index, line in enumerate(lines):
        if is_ignored(line):
            continue

        inline_project = parse_inline_project_line(line)
        if inline_project:
            if current_name:
                entries.append(build_project(current_name, current_desc))
            current_name = inline_project["name"]
            current_desc = [inline_project["description"] or ""]
            continue

        next_line = lines[index + 1] if index + 1 < len(lines) else ""
        if looks_like_project_title(line, next_line):
            if current_name:
                entries.append(build_project(current_name, current_desc))
            current_name = clean_project_title(line)
            current_desc = []
            continue

        cleaned = clean_description_line(line)
        if not cleaned:
            continue

        if current_name:
            current_desc.append(cleaned)
        elif has_project_signal(cleaned) and not ACTION_RE.search(cleaned):
            current_name = infer_project_name(cleaned)
            remainder = cleaned[len(current_name):].strip(" :-|")
            if remainder:
                current_desc.append(remainder)

    if current_name:
        entries.append(build_project(current_name, current_desc))

    return [project for project in entries if is_valid_project(project)]


def parse_inline_project_line(line: str) -> dict[str, Any] | None:
    cleaned = clean_description_line(line)
    if not cleaned:
        return None
    if LINK_RE.fullmatch(cleaned):
        return None

    parts = [part.strip(" -–—|:") for part in PROJECT_DELIMITER_RE.split(cleaned, maxsplit=1)]
    if len(parts) < 2:
        return None

    title, detail = parts[0], parts[1]
    if not looks_like_inline_title(title):
        return None
    if len(detail) < 8 and not TECH_HINT_RE.search(detail):
        return None

    return build_project(title, [detail])


def extract_project_candidates_from_full_text(raw_text: str) -> list[dict[str, Any]]:
    lines = normalize_project_lines(raw_text)
    projects: list[dict[str, Any]] = []

    for index, line in enumerate(lines):
        inline = parse_inline_project_line(line)
        if inline and (has_project_context(lines, index) or has_project_signal(line)):
            projects.append(inline)

    return projects


def normalize_project_lines(projects_text: str) -> list[str]:
    cleaned = (
        projects_text
        .replace("â€¢", "•")
        .replace("Ã¢â‚¬Â¢", "•")
        .replace("Â·", "·")
        .replace("â€“", "–")
        .replace("â€”", "—")
    )
    return [line.strip() for line in cleaned.splitlines() if line.strip()]


def looks_like_project_title(line: str, next_line: str) -> bool:
    stripped = clean_description_line(line)
    if not stripped or is_ignored(stripped) or BULLET_RE.match(line):
        return False
    if len(stripped) > 90 or normalize_key(stripped) in STOP_SECTION_HEADERS:
        return False
    if LINK_RE.search(stripped):
        return False
    if TECH_HINT_RE.search(stripped) and any(separator in stripped for separator in ("|", ",")):
        return False
    if ACTION_RE.search(stripped):
        return False

    next_is_detail = bool(next_line and (BULLET_RE.match(next_line) or has_project_signal(next_line) or len(next_line) > 60))
    title_shape = bool(re.match(r"^[A-Z0-9][A-Za-z0-9 &/().,_-]{2,}$", stripped))
    return title_shape and next_is_detail


def looks_like_inline_title(title: str) -> bool:
    title = title.strip()
    words = title.split()
    if not (1 <= len(words) <= 10):
        return False
    key = normalize_key(title)
    if key in DETAIL_LABELS or key in STOP_SECTION_HEADERS:
        return False
    if ACTION_RE.search(title):
        return False
    return True


def build_project(name: str, desc_lines: list[str]) -> dict[str, Any]:
    description = " ".join(line.strip() for line in desc_lines if line.strip())
    combined = f"{name} {description}"
    technologies = sorted({match.group(0) for match in TECH_HINT_RE.finditer(combined)}, key=str.lower)
    date_match = DATE_RE.search(combined)
    link_match = LINK_RE.search(combined)

    return {
        "name": clean_project_title(name),
        "description": description[:520] or None,
        "date": date_match.group(0).strip() if date_match else None,
        "link": normalize_link(link_match.group(0)) if link_match else None,
        "technologies": technologies[:12],
    }


def has_project_signal(line: str) -> bool:
    return bool(TECH_HINT_RE.search(line) or ACTION_RE.search(line) or LINK_RE.search(line) or "project" in line.lower())


def has_project_context(lines: list[str], index: int) -> bool:
    start = max(0, index - 5)
    context = " ".join(lines[start:index + 1]).lower()
    return any(word in context for word in ("project", "projects", "portfolio", "github", "selected work"))


def infer_project_name(line: str) -> str:
    before_separator = PROJECT_DELIMITER_RE.split(line, maxsplit=1)[0].strip()
    words = before_separator.split()
    if 1 <= len(words) <= 10:
        return before_separator
    return "Project Highlight"


def clean_project_title(line: str) -> str:
    title = clean_description_line(line)
    title = re.sub(r"\s+", " ", title).strip(" :-|")
    return title[:120]


def clean_description_line(line: str) -> str:
    return BULLET_RE.sub("", line).strip()


def normalize_key(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "", value.lower())


def strip_heading_marks(value: str) -> str:
    return value.strip().strip(":").strip()


def looks_like_section_heading(value: str) -> bool:
    return len(strip_heading_marks(value).split()) <= 4 and not BULLET_RE.match(value)


def normalize_link(value: str) -> str:
    value = value.rstrip(").,;")
    if value.startswith(("github.com", "gitlab.com", "bitbucket.org")):
        return f"https://{value}"
    return value


def is_ignored(line: str) -> bool:
    return normalize_key(line) in {normalize_key(item) for item in IGNORE_LINES}


def is_valid_project(project: dict[str, Any]) -> bool:
    name = project.get("name", "")
    description = project.get("description") or ""
    if not name or normalize_key(name) in STOP_SECTION_HEADERS:
        return False
    if len(name.split()) > 12:
        return False
    return bool(description or project.get("technologies") or project.get("link"))


def dedupe_projects(projects: list[dict[str, Any]]) -> list[dict[str, Any]]:
    seen = set()
    unique = []
    for project in projects:
        key = normalize_key(project.get("name", ""))
        if key and key not in seen:
            unique.append(project)
            seen.add(key)
    return unique
