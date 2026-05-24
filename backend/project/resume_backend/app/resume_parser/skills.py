


def extract_all_resume_skills(sections):
    import re

    def normalize_header(text):
        return re.sub(r'\s+', '', text.strip().lower())

    skill_section_keys = [
        "skills", "professional skills", "technical skills", "key skills", "core competencies", "knowledge", "areas of expertise",
        "computer skills", "professional skills and experience", "technical knowledge and skills", "applications", "languages",
        "programming languages", "software", "tools", "technologies", "it skills", "it competencies", "it knowledge",
        "it expertise", "it capabilities", "it proficiencies", "it abilities", "it competencies and experience", "soft skills"
    ]

    degree_keywords = {
        "bachelor", "master", "phd", "mba", "degree", "university", "college", "school", "gpa", "graduated"
    }
    non_skill_keywords = {
        "page", "available", "intern", "assistant", "manager", "technician", "coordinator", "volunteer", "contributor",
        "dean", "scholar", "project", "lab", "office", "university", "school", "college", "committee",
        "lead", "supervisor", "director", "secretary", "address", "dates", "contact", "phone", "email"
    }

    normalized_sections = {normalize_header(k): v for k, v in sections.items()}
    skill_results = {}
    global_seen = set()  # Track all skills seen so far

    for k in skill_section_keys:
        norm_k = normalize_header(k)
        if norm_k in normalized_sections:
            section_text = normalized_sections[norm_k]
            # Split by bullet, middot, comma, or semicolon
            raw_skills = re.split(r"[•·,;]", section_text)
            filtered_skills = []
            for s in raw_skills:
                s_clean = s.strip()
                s_lower = s_clean.lower()
                if (
                    s_clean
                    and len(s_clean) > 2
                    and s_lower not in degree_keywords
                    and s_lower not in non_skill_keywords
                    and not s_lower.isdigit()
                    and s_lower not in global_seen
                ):
                    filtered_skills.append(s_clean)
                    global_seen.add(s_lower)
            pretty_heading = k.title()
            skill_results[pretty_heading] = filtered_skills

    return skill_results




def docx_clean_skills(lines):
    import re
    skills = []
    # Keywords to exclude (not skills)
    exclude_keywords = [
        "university", "college", "school", "institute", "academy", "bachelor", "master", "phd", "mba", "degree",
        "company", "corporation", "inc", "ltd", "llc", "solutions", "technologies", "systems", "pvt", "limited",
        "experience", "project", "resume", "curriculum", "vitae", "profile", "summary", "objective", "history"
    ]
    for line in lines:
        # Only accept bullet points or short lines that look like skills
        if re.match(r"^[-*•·]\s*", line):
            skill = re.sub(r"^[-*•·]\s*", "", line).strip()
        else:
            skill = line.strip()
        # Exclude lines with years/dates, numbers, excluded keywords, or too long/short
        if (
            skill
            and 1 <= len(skill.split()) <= 5
            and not re.search(r"\d{4}", skill)
            and not any(kw in skill.lower() for kw in exclude_keywords)
            and not re.search(r"\d", skill)
            and not skill.isupper()
            and not skill.istitle()
        ):
            skills.append(skill)
    # Remove duplicates, preserve order
    skills = list(dict.fromkeys(skills))
    return skills



def extract_skills_from_docx(sections):
    # Try modern/table/cell extraction first
    docx_skills = docx_clean_skills([line.strip() for line in sections.get("skills, Technical Skills", "").splitlines() if line.strip()])
    # If not enough skills, or empty, fallback to PDF-style extraction
    if not docx_skills or len(docx_skills) < 3:
        # Use the robust PDF-style skill extraction
        skill_dict = extract_all_resume_skills(sections)
        # Flatten all skill lists into one, removing duplicates
        all_skills = []
        seen = set()
        for skill_list in skill_dict.values():
            for skill in skill_list:
                if skill not in seen:
                    all_skills.append(skill)
                    seen.add(skill)
        return all_skills
    return docx_skills
