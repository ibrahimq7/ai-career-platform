import re


def normalize_header(text):
    return re.sub(r'\s+', '', text).lower()

# All known headers normalized
SECTION_HEADERS = [
    "education", "experience", "work history", "skills", "professional skills", "professional skills and experience",
    "technical skills", "technical knowledge and skills", "key skills", "core competencies", "knowledge", "areas of expertise",
    "computer skills", "applications", "languages", "programming languages", "software", "tools", "technologies",
    "it skills", "it competencies", "it knowledge", "it expertise", "it capabilities", "it proficiencies", "it abilities",
    "it competencies and experience", "projects", "certifications", "summary", "objective", "activities", "interests",
    "contact", "references", "community service", "achievements", "awards", "publications", "volunteer work", "hobbies",
    "training", "courses", "professional development", "academic", "qualifications", "degree", "education history",
    "employee history", "employment history", "career history", "career summary", "career objective", "profile",
    "personal statement", "self-summary", "about me", "bio", "introduction", "soft skills"
]
NORMALIZED_HEADERS = set(normalize_header(h) for h in SECTION_HEADERS)


def normalize_header(text):
    return re.sub(r'\s+', '', text.strip().lower())


def extract_sections(resume_text):
    lines = resume_text.splitlines()
    sections = {}
    current_section = None
    buffer = []

    for line in lines:
        line_clean = line.strip().rstrip(":").strip()
        if not line_clean:
            continue

        normalized = normalize_header(line_clean)
        if normalized in NORMALIZED_HEADERS:
            # Save the current section before moving to next
            if current_section and buffer:
                sections[current_section] = '\n'.join(buffer).strip()
                buffer = []
            current_section = normalized
        elif current_section:
            buffer.append(line_clean)

    # Save last section
    if current_section and buffer:
        sections[current_section] = '\n'.join(buffer).strip()

    return sections


def get_merged_section(sections, keys):
    """Merge multiple possible section contents into one string."""
    merged = []
    for k in keys:
        content = sections.get(k, "")
        if content:
            merged.append(content)
    return "\n\n".join(merged).strip() if merged else None