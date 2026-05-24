from .section_utils import normalize_header
import re
from io import BytesIO
from docx import Document



def clean_experience(text):
    import re
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    if len(lines) > 12:
        # Fussy logic (your current code)
        filtered_lines = []
        section_headers = [
            "education", "experience", "work history", "professional experience", "skills", "projects", "certifications",
            "summary", "objective", "activities", "interests", "languages", "contact", "references", "community service",
            "achievements", "awards", "publications", "volunteer work", "hobbies", "training", "courses", "professional developoment",
            "academic", "qualifications", "degree", "education history", "employee history", "employment history", "career history",
            "career summary", "career objective", "profile", "personal statement", "self-summary", "about me", "bio", "intoduction",
            "work", "professional", "career", "employment", "experience summary"
        ]
        normalized_headers = set(re.sub(r'\s+', '', h).lower() for h in section_headers)
        date_pattern = re.compile(
            r"\b(?:(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)[A-Z]*\s+)?(?:20XX|19\d{2}|20\d{2})"
            r"(?:\s*[–\-to]+\s*(?:PRESENT|20XX|19\d{2}|20\d{2}|present|(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)[A-Z]*\s+\d{4}))?",
            re.IGNORECASE
        )
        for i, line in enumerate(lines):
            norm = re.sub(r'\s+', '', line).lower()
            if norm in normalized_headers and i != 0:
                break
            if (
                date_pattern.search(line)
                or (2 <= len(line.split()) <= 10 and (line.istitle() or line.isupper()) and not re.search(r"\d{4}", line))
            ):
                filtered_lines.append(line)
            elif i + 1 < len(lines) and date_pattern.search(lines[i + 1]):
                if 2 <= len(line.split()) <= 10 and (line.istitle() or line.isupper()):
                    filtered_lines.append(line)
        filtered_lines = list(dict.fromkeys(filtered_lines))
        return "\n".join(filtered_lines) if filtered_lines else None
    else:
        return normal_experience(lines)




def clean_experience_block(text):
    import re
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    blocks = []
    i = 0
    date_pattern = re.compile(r"(20\d{2}|19\d{2})(\s*[–\-to]+\s*(Present|20\d{2}|19\d{2}|present))?", re.IGNORECASE)
    while i < len(lines):
        # Company
        if (2 <= len(lines[i].split()) <= 8 and (lines[i].istitle() or lines[i].isupper())):
            company = lines[i]
            i += 1
            # Date (optional)
            date = ""
            if i < len(lines) and date_pattern.match(lines[i]):
                date = lines[i]
                i += 1
            # Description (up to 5 lines)
            desc_lines = []
            desc_count = 0
            while i < len(lines) and desc_count < 5:
                # Stop if next line looks like a new company or date
                if (2 <= len(lines[i].split()) <= 8 and (lines[i].istitle() or lines[i].isupper())):
                    break
                if date_pattern.match(lines[i]):
                    break
                desc_lines.append(lines[i])
                desc_count += 1
                i += 1
            block = [company]
            if date:
                block.append(date)
            if desc_lines:
                block.extend(desc_lines)
            blocks.append("\n".join(block))
        else:
            i += 1
    return "\n\n".join(blocks)




def normal_experience(lines):
    import re
    section_headers = [
        "education", "experience", "work history", "professional experience", "skills", "projects", "certifications",
        "summary", "objective", "activities", "interests", "languages", "contact", "references", "community service",
        "achievements", "awards", "publications", "volunteer work", "hobbies", "training", "courses", "professional developoment",
        "academic", "qualifications", "degree", "education history", "employee history", "employment history", "career history",
        "career summary", "career objective", "profile", "personal statement", "self-summary", "about me", "bio", "intoduction",
        "work", "professional", "career", "employment", "experience summary"
    ]
    normalized_headers = set(re.sub(r'\s+', '', h).lower() for h in section_headers)
    date_pattern = re.compile(
        r"\b(?:(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)[A-Z]*\s+)?(?:20XX|19\d{2}|20\d{2})"
        r"(?:\s*[–\-to]+\s*(?:PRESENT|20XX|19\d{2}|20\d{2}|present|(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)[A-Z]*\s+\d{4}))?",
        re.IGNORECASE
    )
    result = []
    i = 0
    while i < len(lines):
        line = lines[i]
        norm = re.sub(r'\s+', '', line).lower()
        # Only start a block if this is a heading (not a section header)
        if (2 <= len(line.split()) <= 15 and norm not in normalized_headers):
            # If date is on the same line, split and add both
            match = date_pattern.search(line)
            if match:
                date_str = match.group()
                heading = line.replace(date_str, '').strip(" ,.-")
                if heading:
                    result.append(heading)
                result.append(date_str)
            # If next line is a date, add it
            elif i + 1 < len(lines) and date_pattern.search(lines[i + 1]):
                result.append(line)
                result.append(lines[i + 1])
                i += 1
            else:
                result.append(line)
        i += 1
    # Remove duplicates, preserve order
    result = list(dict.fromkeys(result))
    return "\n".join(result) if result else None




def extract_experience_from_docx_tables(file_bytes):

    section_headers = [
        "education", "skills", "projects", "certifications", "summary", "objective", "activities", "interests",
        "languages", "contact", "references", "community service", "achievements", "awards", "publications",
        "volunteer work", "hobbies", "training", "courses", "profile"
    ]
    normalized_headers = set(normalize_header(h) for h in section_headers)
    date_pattern = re.compile(r"(20\d{2}|19\d{2})(\s*[–\-to]+\s*(Present|20\d{2}|19\d{2}|present))?", re.IGNORECASE)

    try:
        doc = Document(BytesIO(file_bytes))
        for table in doc.tables:
            cells = []
            for row in table.rows:
                for cell in row.cells:
                    text = cell.text.strip()
                    if text:
                        cells.append(text)
            # Find the index of the "EXPERIENCE" cell
            exp_idx = None
            for idx, cell in enumerate(cells):
                if normalize_header(cell) == "experience":
                    exp_idx = idx
                    break
            if exp_idx is not None:
                i = exp_idx + 1
                blocks = []
                while i < len(cells):
                    if normalize_header(cells[i]) in normalized_headers:
                        break
                    # Company
                    company = cells[i]
                    i += 1
                    # Date (optional)
                    date = ""
                    if i < len(cells) and date_pattern.match(cells[i]):
                        date = cells[i]
                        i += 1
                    # Description (up to 5 lines)
                    desc_lines = []
                    desc_count = 0
                    while i < len(cells) and desc_count < 5:
                        if normalize_header(cells[i]) in normalized_headers:
                            break
                        # Stop if next cell looks like a company or date
                        if (2 <= len(cells[i].split()) <= 8 and (cells[i].istitle() or cells[i].isupper()) and not re.search(r"\d{4}", cells[i])):
                            break
                        if date_pattern.match(cells[i]):
                            break
                        desc_lines.append(cells[i])
                        desc_count += 1
                        i += 1
                    block = [company]
                    if date:
                        block.append(date)
                    if desc_lines:
                        block.extend(desc_lines)
                    blocks.append("\n".join(block))
                if blocks:
                    return "\n\n".join(blocks)
    except Exception as e:
        print(f"[DOCX Table Experience Extraction Error]: {e}")
    return None




def extract_experience_from_docx_paragraphs(sections):
    import re
    date_pattern = re.compile(r"(20\d{2}|19\d{2})(\s*[–\-to]+\s*(Present|20\d{2}|19\d{2}|present))?", re.IGNORECASE)
    section_headers = [
        "education", "skills", "projects", "certifications", "summary", "objective", "activities", "interests",
        "languages", "contact", "references", "community service", "achievements", "awards", "publications",
        "volunteer work", "hobbies", "training", "courses", "profile"
    ]
    normalized_headers = set(normalize_header(h) for h in section_headers)
    exp_keys = [
        "experience", "workhistory", "professionalexperience", "employmenthistory",
        "careerhistory", "careerexperience", "workexperience", "jobhistory", "jobexperience"
    ]
    exp_section = None
    for k in exp_keys:
        if k in sections:
            exp_section = sections[k]
            break
    if not exp_section:
        for k, v in sections.items():
            if "experience" in k:
                exp_section = v
                break
    if not exp_section:
        return ""
    lines = [line.strip() for line in exp_section.splitlines() if line.strip()]
    blocks = []
    i = 0
    while i < len(lines):
        # Company
        if (2 <= len(lines[i].split()) <= 8 and (lines[i].istitle() or lines[i].isupper()) and not re.search(r"\d{4}", lines[i]) and normalize_header(lines[i]) not in normalized_headers):
            company = lines[i]
            i += 1
            # Date (optional)
            date = ""
            if i < len(lines) and date_pattern.match(lines[i]):
                date = lines[i]
                i += 1
            # Description (up to 5 lines)
            desc_lines = []
            desc_count = 0
            while i < len(lines) and desc_count < 5:
                if normalize_header(lines[i]) in normalized_headers:
                    break
                if (2 <= len(lines[i].split()) <= 8 and (lines[i].istitle() or lines[i].isupper()) and not re.search(r"\d{4}", lines[i])):
                    break
                if date_pattern.match(lines[i]):
                    break
                desc_lines.append(lines[i])
                desc_count += 1
                i += 1
            block = [company]
            if date:
                block.append(date)
            if desc_lines:
                block.extend(desc_lines)
            blocks.append("\n".join(block))
        else:
            i += 1
    return "\n\n".join(blocks)



def extract_experience_block_from_sections(sections):
    # Try all normalized experience-related keys
    exp_keys = [
        "experience", "workhistory", "professionalexperience", "employmenthistory",
        "careerhistory", "careerexperience", "workexperience", "jobhistory", "jobexperience"
    ]
    for k in exp_keys:
        if k in sections:
            return sections[k]
    # Fallback: any section containing "experience"
    for k, v in sections.items():
        if "experience" in k:
            return v
    return ""



def clean_experience_block(text):
    import re
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    blocks = []
    i = 0
    date_pattern = re.compile(r"(20\d{2}|19\d{2})(\s*[–\-to]+\s*(Present|20\d{2}|19\d{2}|present))?", re.IGNORECASE)
    while i < len(lines):
        # Company
        if (2 <= len(lines[i].split()) <= 8 and (lines[i].istitle() or lines[i].isupper())):
            company = lines[i]
            i += 1
            # Date (optional)
            date = ""
            if i < len(lines) and date_pattern.match(lines[i]):
                date = lines[i]
                i += 1
            # Description (up to 5 lines)
            desc_lines = []
            desc_count = 0
            while i < len(lines) and desc_count < 5:
                # Stop if next line looks like a new company or date
                if (2 <= len(lines[i].split()) <= 8 and (lines[i].istitle() or lines[i].isupper())):
                    break
                if date_pattern.match(lines[i]):
                    break
                desc_lines.append(lines[i])
                desc_count += 1
                i += 1
            block = [company]
            if date:
                block.append(date)
            if desc_lines:
                block.extend(desc_lines)
            blocks.append("\n".join(block))
        else:
            i += 1
    return "\n\n".join(blocks)



def extract_experience_blocks_flexible(raw_text):
    import re
    lines = [line.strip() for line in raw_text.splitlines() if line.strip()]
    section_headers = [
        "education", "projects", "certifications", "summary", "objective", "activities", "interests",
        "languages", "contact", "references", "community service", "achievements", "awards", "publications",
        "volunteer work", "hobbies", "training", "courses", "profile"
    ]
    normalized_headers = set(h.replace(" ", "").lower() for h in section_headers)
    # Find the EXPERIENCE section
    start = None
    for idx, line in enumerate(lines):
        if line.replace(" ", "").lower() == "experience":
            start = idx + 1
            break
    if start is None:
        return ""
    # Collect lines until next major section header (not skills)
    exp_lines = []
    for line in lines[start:]:
        norm = line.replace(" ", "").lower()
        if norm in normalized_headers:
            break
        exp_lines.append(line)
    date_pattern = re.compile(r"(20\d{2}|19\d{2})(\s*[–\-to]+\s*(Present|20\d{2}|19\d{2}|present))?", re.IGNORECASE)
    skip_headers = {"skills"}
    skill_keywords = {"design", "python", "java", "c++", "django", "machine learning", "communication", "problem solving"}
    blocks = []
    i = 0
    company = None
    date = ""
    desc_lines = []
    while i < len(exp_lines):
        line = exp_lines[i]
        norm = line.replace(" ", "").lower()
        words = line.split()
        is_skill_line = (
            norm in skip_headers or
            (1 <= len(words) <= 5 and any(kw in line.lower() for kw in skill_keywords) and not date_pattern.match(line))
        )
        # Skip skill lines
        if is_skill_line:
            i += 1
            continue
        # Company
        is_company = (2 <= len(words) <= 8 and (line.istitle() or line.isupper()))
        if is_company:
            if company and (desc_lines or date):
                block = [company]
                if date:
                    block.append(date)
                if desc_lines:
                    block.extend(desc_lines)
                blocks.append("\n".join(block))
                date = ""
                desc_lines = []
            company = line
            i += 1
            # Date (optional)
            if i < len(exp_lines) and date_pattern.match(exp_lines[i]):
                date = exp_lines[i]
                i += 1
            else:
                date = ""
            # Description (up to 5 lines)
            desc_lines = []
            desc_count = 0
            while i < len(exp_lines) and desc_count < 5:
                desc_line = exp_lines[i]
                norm2 = desc_line.replace(" ", "").lower()
                words2 = desc_line.split()
                is_skill_line2 = (
                    norm2 in skip_headers or
                    (1 <= len(words2) <= 5 and any(kw in desc_line.lower() for kw in skill_keywords) and not date_pattern.match(desc_line))
                )
                if is_skill_line2:
                    i += 1
                    continue
                if (2 <= len(words2) <= 8 and (desc_line.istitle() or desc_line.isupper())):
                    break
                if date_pattern.match(desc_line):
                    break
                desc_lines.append(desc_line)
                desc_count += 1
                i += 1
        else:
            i += 1
    # Add the last block if any
    if company and (desc_lines or date):
        block = [company]
        if date:
            block.append(date)
        if desc_lines:
            block.extend(desc_lines)
        blocks.append("\n".join(block))
    return "\n\n".join(blocks)
