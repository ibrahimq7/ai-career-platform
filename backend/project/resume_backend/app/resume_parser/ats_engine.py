import re
from typing import Any


TARGET_ROLE_SKILLS = {
    "frontend developer": {"javascript", "typescript", "react", "html", "css", "tailwind", "redux", "git", "api"},
    "backend developer": {"python", "fastapi", "django", "node.js", "sql", "postgresql", "docker", "aws", "api"},
    "full stack developer": {"javascript", "typescript", "react", "node.js", "python", "sql", "docker", "aws", "git"},
    "data analyst": {"python", "sql", "excel", "tableau", "power bi", "statistics", "pandas", "numpy"},
    "machine learning engineer": {"python", "machine learning", "deep learning", "pytorch", "tensorflow", "sql", "docker", "aws"},
}

DEFAULT_TARGET_ROLE = "full stack developer"

JOB_TITLE_PATTERNS = [
    "full stack developer",
    "frontend developer",
    "front end developer",
    "backend developer",
    "back end developer",
    "software engineer",
    "software developer",
    "data analyst",
    "data scientist",
    "machine learning engineer",
    "ai engineer",
    "devops engineer",
    "cloud engineer",
    "android developer",
    "web developer",
    "ui developer",
    "qa engineer",
]

LEARNING_LIBRARY = {
    "typescript": ("TypeScript Handbook", "Documentation", "https://www.typescriptlang.org/docs/"),
    "docker": ("Docker Get Started", "Documentation", "https://docs.docker.com/get-started/"),
    "aws": ("AWS Skill Builder", "AWS Training", "https://skillbuilder.aws/"),
    "fastapi": ("FastAPI Tutorial", "Documentation", "https://fastapi.tiangolo.com/tutorial/"),
    "postgresql": ("PostgreSQL Tutorial", "Documentation", "https://www.postgresql.org/docs/current/tutorial.html"),
    "react": ("React Learn", "Documentation", "https://react.dev/learn"),
    "sql": ("SQL Tutorial", "FreeCodeCamp", "https://www.freecodecamp.org/news/tag/sql/"),
    "git": ("Git and GitHub Crash Course", "YouTube", "https://www.youtube.com/results?search_query=git+github+crash+course"),
}


def build_resume_intelligence(parsed_resume: dict[str, Any], target_role: str | None = None) -> dict[str, Any]:
    role = normalize_role(target_role)
    skills = flatten_skills(parsed_resume.get("skills_found"))
    resume_text = parsed_resume.get("resume_text") or ""
    categories = score_categories(parsed_resume, skills, resume_text, role)
    overall = round(sum(item["score"] * item["weight"] for item in categories) / sum(item["weight"] for item in categories))
    missing_skills = get_missing_skills(skills, role)

    return {
        "target_role": role.title(),
        "ats_score": overall,
        "score_breakdown": categories,
        "missing_skills": missing_skills,
        "suggestions": build_suggestions(categories, missing_skills),
        "course_recommendations": build_course_recommendations(missing_skills),
        "parsed_resume": normalize_parsed_resume(parsed_resume, skills),
    }


def normalize_role(target_role: str | None) -> str:
    if not target_role:
        return DEFAULT_TARGET_ROLE
    normalized = target_role.strip().lower()
    return normalized if normalized in TARGET_ROLE_SKILLS else DEFAULT_TARGET_ROLE


def flatten_skills(raw_skills: Any) -> list[str]:
    values: list[str] = []
    if isinstance(raw_skills, dict):
        for group in raw_skills.values():
            if isinstance(group, list):
                values.extend(str(skill).strip() for skill in group)
    elif isinstance(raw_skills, list):
        values.extend(str(skill).strip() for skill in raw_skills)

    seen = set()
    clean = []
    for skill in values:
        key = skill.lower()
        if skill and key not in seen:
            clean.append(skill)
            seen.add(key)
    return clean


def score_categories(parsed_resume: dict[str, Any], skills: list[str], resume_text: str, role: str) -> list[dict[str, Any]]:
    text = resume_text.lower()
    skill_keys = {skill.lower() for skill in skills}
    role_skills = TARGET_ROLE_SKILLS[role]
    matched_role_skills = skill_keys.intersection(role_skills)

    has_contact = bool(parsed_resume.get("email")) + bool(parsed_resume.get("phone"))
    has_sections = sum(bool(parsed_resume.get(key)) for key in ("education", "experience", "projects"))
    bullets = len(re.findall(r"(^|\n)\s*[-*•]", resume_text))
    metrics = len(re.findall(r"\b\d+%|\b\d+\+|\b\d+x|\b\d+\s*(users|clients|projects|apis|features|hours)\b", text))
    action_verbs = len(re.findall(r"\b(built|developed|designed|implemented|optimized|led|created|improved|automated|deployed)\b", text))
    keyword_hits = len(set(re.findall(r"\b(api|cloud|database|testing|frontend|backend|deployment|analytics|security)\b", text)))

    return [
        category("Skill Match", ratio_score(len(matched_role_skills), max(len(role_skills), 1)), 0.22, matched_role_skills),
        category("Resume Formatting", min(100, has_contact * 25 + has_sections * 15 + min(bullets, 8) * 4), 0.13),
        category("Experience Relevance", min(100, (35 if parsed_resume.get("experience") else 0) + action_verbs * 8), 0.15),
        category("Project Quality", min(100, (35 if parsed_resume.get("projects") else 0) + metrics * 10 + action_verbs * 3), 0.13),
        category("Keyword Optimization", min(100, keyword_hits * 12 + len(matched_role_skills) * 5), 0.14),
        category("Achievement Strength", min(100, metrics * 18 + action_verbs * 5), 0.12),
        category("Readability", min(100, 45 + min(len(resume_text.split()), 700) // 14), 0.06),
        category("ATS Compatibility", min(100, 40 + has_contact * 20 + has_sections * 10), 0.05),
    ]


def category(name: str, score: float, weight: float, matches: set[str] | None = None) -> dict[str, Any]:
    return {
        "name": name,
        "score": round(score),
        "weight": weight,
        "matches": sorted(matches or []),
    }


def ratio_score(numerator: int, denominator: int) -> int:
    return min(100, round((numerator / denominator) * 100))


def get_missing_skills(skills: list[str], role: str) -> list[str]:
    current = {skill.lower() for skill in skills}
    missing = [skill for skill in TARGET_ROLE_SKILLS[role] if skill not in current]
    priority = ["typescript", "docker", "aws", "postgresql", "fastapi", "react", "sql", "git"]
    return sorted(missing, key=lambda item: priority.index(item) if item in priority else 99)[:6]


def build_suggestions(categories: list[dict[str, Any]], missing_skills: list[str]) -> list[str]:
    suggestions = []
    weak_categories = [item for item in categories if item["score"] < 70]
    for item in weak_categories[:4]:
        if item["name"] == "Achievement Strength":
            suggestions.append("Add measurable impact to bullets, such as percentages, scale, users, revenue, or time saved.")
        elif item["name"] == "Keyword Optimization":
            suggestions.append("Mirror role-specific keywords naturally across summary, skills, projects, and experience.")
        elif item["name"] == "Project Quality":
            suggestions.append("For each project, include the problem, tech stack, your contribution, and the measurable outcome.")
        elif item["name"] == "Skill Match":
            suggestions.append("Prioritize the missing role skills most relevant to your target job.")
    if missing_skills:
        suggestions.append(f"Start with these skill gaps: {', '.join(skill.title() for skill in missing_skills[:4])}.")
    return suggestions or ["Resume fundamentals look strong. Tailor keywords and achievements for each job description."]


def build_course_recommendations(missing_skills: list[str]) -> list[dict[str, str]]:
    recommendations = []
    for skill in missing_skills[:6]:
        title, platform, url = LEARNING_LIBRARY.get(
            skill,
            (f"{skill.title()} Fundamentals", "Curated Search", f"https://www.youtube.com/results?search_query={skill}+tutorial"),
        )
        recommendations.append(
            {
                "skill": skill.title(),
                "title": title,
                "platform": platform,
                "url": url,
            }
        )
    return recommendations


def normalize_parsed_resume(parsed_resume: dict[str, Any], skills: list[str]) -> dict[str, Any]:
    resume_text = str(parsed_resume.get("resume_text") or "")
    return {
        "name": parsed_resume.get("name") or "Not detected",
        "email": parsed_resume.get("email") or "Not detected",
        "phone": parsed_resume.get("phone") or "Not detected",
        "address": parsed_resume.get("address") or "",
        "inferred_role": infer_resume_role(resume_text, skills),
        "education": parsed_resume.get("education") or "",
        "experience": parsed_resume.get("experience") or "",
        "skills": skills,
        "projects": parsed_resume.get("projects") or [],
        "resume_text": resume_text[:8000],
    }


def infer_resume_role(resume_text: str, skills: list[str]) -> str:
    head = "\n".join(resume_text.splitlines()[:35]).lower()
    all_text = resume_text.lower()

    for title in JOB_TITLE_PATTERNS:
        if re.search(rf"\b{re.escape(title)}\b", head):
            return title.title().replace("Ai ", "AI ").replace("Qa ", "QA ").replace("Ui ", "UI ")

    for title in JOB_TITLE_PATTERNS:
        if re.search(rf"\b{re.escape(title)}\b", all_text):
            return title.title().replace("Ai ", "AI ").replace("Qa ", "QA ").replace("Ui ", "UI ")

    skill_keys = {skill.lower() for skill in skills}
    if {"react", "javascript"}.intersection(skill_keys) and {"node.js", "python", "sql"}.intersection(skill_keys):
        return "Full Stack Developer"
    if {"react", "javascript", "html", "css"}.intersection(skill_keys):
        return "Frontend Developer"
    if {"python", "fastapi", "django", "node.js", "sql"}.intersection(skill_keys):
        return "Backend Developer"
    if {"python", "sql", "excel", "tableau", "power bi"}.intersection(skill_keys):
        return "Data Analyst"

    return "Not detected"
