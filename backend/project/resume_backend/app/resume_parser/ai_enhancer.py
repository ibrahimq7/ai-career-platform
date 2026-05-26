import json
import os
import re
import time
from typing import Any

import requests


def enhance_with_gemini(analysis: dict[str, Any]) -> dict[str, Any]:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return disabled_enhancement("Gemini is not configured.")

    model = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
    timeout = int(os.getenv("GEMINI_TIMEOUT_SECONDS", "25"))
    attempts = max(1, int(os.getenv("GEMINI_RETRY_ATTEMPTS", "2")))
    prompt_payload = build_prompt_payload(analysis)
    last_error = ""

    for attempt in range(attempts):
        try:
            response = requests.post(
                f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent",
                params={"key": api_key},
                json=build_request_body(prompt_payload),
                timeout=timeout,
            )
            response.raise_for_status()
            text = response.json()["candidates"][0]["content"]["parts"][0]["text"]
            return normalize_enhancement(parse_gemini_json(text), analysis)
        except Exception as exc:
            last_error = str(exc)
            if attempt < attempts - 1:
                time.sleep(0.8 * (attempt + 1))

    return fallback_enhancement(f"Gemini returned an incomplete response after {attempts} attempt(s): {last_error}", analysis)


def build_request_body(prompt_payload: dict[str, Any]) -> dict[str, Any]:
    return {
        "contents": [
            {
                "parts": [
                    {
                        "text": (
                            "You are an expert technical recruiter, ATS strategist, and career coach. "
                            "Analyze only the structured JSON provided. Do not invent employment, degrees, links, or skills. "
                            "Return strict JSON with keys: summary, ats_explanation, job_eligibility, eligibility_score, "
                            "eligibility_reason, priority_actions, dream_job_fit, skill_gap_analysis, career_roadmap, "
                            "achievement_feedback, project_recommendations, interview_questions."
                        )
                    },
                    {"text": json.dumps(prompt_payload, ensure_ascii=True, separators=(",", ":"))},
                ]
            }
        ],
        "generationConfig": {
            "temperature": 0.25,
            "topP": 0.9,
            "maxOutputTokens": 1800,
            "responseMimeType": "application/json",
            "responseSchema": {
                "type": "OBJECT",
                "properties": {
                    "summary": {"type": "STRING"},
                    "ats_explanation": {"type": "STRING"},
                    "job_eligibility": {"type": "STRING"},
                    "eligibility_score": {"type": "INTEGER"},
                    "eligibility_reason": {"type": "STRING"},
                    "priority_actions": {"type": "ARRAY", "items": {"type": "STRING"}},
                    "dream_job_fit": {"type": "STRING"},
                    "skill_gap_analysis": {"type": "ARRAY", "items": {"type": "STRING"}},
                    "career_roadmap": {"type": "ARRAY", "items": {"type": "STRING"}},
                    "achievement_feedback": {"type": "ARRAY", "items": {"type": "STRING"}},
                    "project_recommendations": {"type": "ARRAY", "items": {"type": "STRING"}},
                    "interview_questions": {"type": "ARRAY", "items": {"type": "STRING"}},
                },
                "required": [
                    "summary",
                    "ats_explanation",
                    "job_eligibility",
                    "eligibility_score",
                    "eligibility_reason",
                    "priority_actions",
                    "dream_job_fit",
                    "skill_gap_analysis",
                    "career_roadmap",
                    "achievement_feedback",
                    "project_recommendations",
                    "interview_questions",
                ],
            },
        },
    }


def build_prompt_payload(analysis: dict[str, Any]) -> dict[str, Any]:
    parsed_resume = analysis.get("parsed_resume", {})
    return {
        "target_role": analysis.get("target_role"),
        "ats_score": analysis.get("ats_score"),
        "score_breakdown": slim_score_breakdown(analysis.get("score_breakdown", [])),
        "missing_skills": analysis.get("missing_skills", [])[:8],
        "deterministic_suggestions": analysis.get("suggestions", [])[:6],
        "resume": {
            "name_present": parsed_resume.get("name") != "Not detected",
            "email_present": parsed_resume.get("email") != "Not detected",
            "phone_present": parsed_resume.get("phone") != "Not detected",
            "education": truncate(parsed_resume.get("education", ""), 900),
            "experience": truncate(parsed_resume.get("experience", ""), 1600),
            "skills": parsed_resume.get("skills", [])[:35],
            "projects": slim_projects(parsed_resume.get("projects", [])),
        },
    }


def normalize_enhancement(data: dict[str, Any], analysis: dict[str, Any] | None = None) -> dict[str, Any]:
    fallback_eligibility = algorithmic_eligibility(analysis or {})
    eligibility_score = clamp_int(data.get("eligibility_score"), fallback_eligibility["eligibility_score"])
    eligibility = str(data.get("job_eligibility") or fallback_eligibility["job_eligibility"]).strip()

    return {
        "enabled": True,
        "summary": str(data.get("summary", ""))[:900],
        "ats_explanation": str(data.get("ats_explanation", ""))[:1200],
        "job_eligibility": eligibility,
        "eligibility_score": eligibility_score,
        "eligibility_reason": str(data.get("eligibility_reason") or fallback_eligibility["eligibility_reason"])[:900],
        "priority_actions": as_string_list(data.get("priority_actions"), 6),
        "dream_job_fit": str(data.get("dream_job_fit", ""))[:900],
        "skill_gap_analysis": as_string_list(data.get("skill_gap_analysis"), 6),
        "career_roadmap": as_string_list(data.get("career_roadmap"), 6),
        "achievement_feedback": as_string_list(data.get("achievement_feedback"), 5),
        "project_recommendations": as_string_list(data.get("project_recommendations"), 5),
        "interview_questions": as_string_list(data.get("interview_questions"), 8),
        "model": os.getenv("GEMINI_MODEL", "gemini-2.5-flash"),
    }


def fallback_enhancement(reason: str, analysis: dict[str, Any]) -> dict[str, Any]:
    fallback_eligibility = algorithmic_eligibility(analysis)
    missing = analysis.get("missing_skills", []) or []
    suggestions = analysis.get("suggestions", []) or []
    role = analysis.get("target_role") or "the target role"

    return {
        "enabled": True,
        "reason": reason,
        "summary": f"Structured resume analysis completed for {role}. Gemini did not return valid JSON, so this report uses deterministic ATS signals while keeping the semantic sections available.",
        "ats_explanation": fallback_eligibility["eligibility_reason"],
        "job_eligibility": fallback_eligibility["job_eligibility"],
        "eligibility_score": fallback_eligibility["eligibility_score"],
        "eligibility_reason": fallback_eligibility["eligibility_reason"],
        "priority_actions": suggestions[:6],
        "dream_job_fit": fallback_eligibility["eligibility_reason"],
        "skill_gap_analysis": [f"Close gap: {skill.title()}" for skill in missing[:6]],
        "career_roadmap": [
            "Tailor the summary and skills section to the selected target role.",
            "Strengthen two projects with measurable outcomes and clear technology stacks.",
            "Add role keywords naturally into experience and project bullets.",
        ],
        "achievement_feedback": [
            "Add measurable impact such as scale, latency, users, revenue, accuracy, or time saved.",
        ],
        "project_recommendations": [
            "Build one target-role project that combines the missing skills with a deployable outcome.",
        ],
        "interview_questions": [
            f"Tell me about the strongest project on your resume for a {role} role.",
            "Which technical tradeoff from your resume would you explain to a senior engineer?",
        ],
        "model": os.getenv("GEMINI_MODEL", "gemini-2.5-flash"),
    }


def disabled_enhancement(reason: str, analysis: dict[str, Any] | None = None) -> dict[str, Any]:
    fallback_eligibility = algorithmic_eligibility(analysis or {})
    return {
        "enabled": False,
        "reason": reason,
        "summary": "",
        "ats_explanation": "",
        "job_eligibility": fallback_eligibility["job_eligibility"],
        "eligibility_score": fallback_eligibility["eligibility_score"],
        "eligibility_reason": fallback_eligibility["eligibility_reason"],
        "priority_actions": [],
        "dream_job_fit": "",
        "skill_gap_analysis": [],
        "career_roadmap": [],
        "achievement_feedback": [],
        "project_recommendations": [],
        "interview_questions": [],
        "model": None,
    }


def algorithmic_eligibility(analysis: dict[str, Any]) -> dict[str, Any]:
    score = int(analysis.get("ats_score") or 0)
    missing = analysis.get("missing_skills", []) or []
    role = analysis.get("target_role") or "the target role"

    if score >= 80:
        label = "Strong fit"
        reason = f"The resume is currently a strong fit for {role}, with only targeted tailoring needed."
    elif score >= 65:
        label = "Potential fit"
        reason = f"The resume can be competitive for {role}, but should close gaps such as {', '.join(missing[:3]) or 'role-specific keywords'}."
    else:
        label = "Needs improvement"
        reason = f"The resume needs stronger alignment for {role}, especially around skills, projects, keywords, and measurable achievements."

    return {
        "job_eligibility": label,
        "eligibility_score": score,
        "eligibility_reason": reason,
    }


def slim_score_breakdown(items: Any) -> list[dict[str, Any]]:
    if not isinstance(items, list):
        return []
    return [
        {
            "name": item.get("name"),
            "score": item.get("score"),
            "matches": item.get("matches", [])[:8],
        }
        for item in items[:9]
        if isinstance(item, dict)
    ]


def slim_projects(projects: Any) -> list[dict[str, Any]]:
    if not isinstance(projects, list):
        return []
    slimmed = []
    for project in projects[:8]:
        if not isinstance(project, dict):
            continue
        slimmed.append(
            {
                "name": truncate(project.get("name", ""), 120),
                "description": truncate(project.get("description", ""), 420),
                "technologies": project.get("technologies", [])[:10],
            }
        )
    return slimmed


def as_string_list(value: Any, limit: int) -> list[str]:
    if not isinstance(value, list):
        return []
    return [str(item)[:320] for item in value if str(item).strip()][:limit]


def clamp_int(value: Any, fallback: int) -> int:
    try:
        return max(0, min(100, int(value)))
    except (TypeError, ValueError):
        return fallback


def truncate(value: Any, limit: int) -> str:
    text = str(value or "")
    return text[:limit]


def parse_gemini_json(text: str) -> dict[str, Any]:
    cleaned = text.strip()
    cleaned = re.sub(r"^```(?:json)?\s*", "", cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r"\s*```$", "", cleaned)

    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        match = re.search(r"\{.*\}", cleaned, flags=re.DOTALL)
        if match:
            return json.loads(match.group(0))
        raise
