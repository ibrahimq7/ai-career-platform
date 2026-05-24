import re


def clean_education(text):
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    filtered_lines = []
    edu_keywords = [
        "bachelor", "master", "phd", "b.sc", "m.sc", "mba", "ba", "bs", "b.tech", "m.tech",
        "bca", "mca", "university", "college", "school", "institute", "arts", "science", "fine arts", "degree"
    ]
    date_pattern = re.compile(
        r"\b(?:(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)[A-Z]*\s+)?(?:20XX|19\d{2}|20\d{2})"
        r"(?:\s*[–\-]\s*(?:PRESENT|20XX|19\d{2}|20\d{2}|(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)[A-Z]*\s+\d{4}))?",
        re.IGNORECASE
    )
    for i, line in enumerate(lines):
        l = line.lower()
        # Only keep lines that look like degree, school, or year (sideheadings)
        if (
            any(kw in l for kw in edu_keywords)
            or date_pattern.search(line)
            or (1 <= len(line.split()) <= 7 and (line == line.title() or line.isupper()))
        ):
            filtered_lines.append(line)
        # If the next line is a date, treat this as a heading too
        elif i + 1 < len(lines) and date_pattern.search(lines[i + 1]):
            # Only include if this line is short (likely a heading)
            if 1 <= len(line.split()) <= 7:
                filtered_lines.append(line)
    # Remove duplicates, preserve order
    filtered_lines = list(dict.fromkeys(filtered_lines))
    return "\n".join(filtered_lines) if filtered_lines else None


def docx_clean_education(lines):
    result = []
    block = []
    for i, line in enumerate(lines):
        l = line.lower()
        if re.search(r"(university|institute|college)", l):
            if block:
                result.append("\n".join(block))
                block = []
            block.append(line)
        elif re.search(r"(bachelor|master|phd|mba|arts|science|fine arts|degree)", l):
            block.append(line)
        elif re.search(r"(20XX|19\d{2}|20\d{2}|present)", line, re.IGNORECASE):
            block.insert(1, line)
    if block:
        result.append("\n".join(block))
    return "\n\n".join(result).strip() if result else None
