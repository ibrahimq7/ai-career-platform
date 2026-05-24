def extract_projects(sections):
    import re

    project_section_keys = [
        "projects", "personalprojects", "academicprojects", "keyprojects", "majorprojects", "projectexperience",
        "notableprojects", "selectedprojects", "relevantprojects", "projectwork", 
    ]
    ignore_headings = {
        "sample resume", "curriculum vitae", "resume", "cv", "profile", "page", "contact", "summary"
    }
    normalized_sections = {re.sub(r'\s+', '', k).lower(): v for k, v in sections.items()}

    # Find the first matching project section
    projects_text = ""
    for k in project_section_keys:
        if k in normalized_sections:
            projects_text = normalized_sections[k]
            break
    if not projects_text.strip():
        return []

    lines = [line.strip() for line in projects_text.splitlines() if line.strip()]
    projects = []
    i = 0
    while i < len(lines):
        line = lines[i]
        # Ignore lines in ignore_headings
        if line.strip().lower() in ignore_headings:
            i += 1
            continue

        # Heading: any non-bullet, non-empty line not in ignore list
        is_heading = (
            not re.match(r"^[-*•·]\s*", line) and
            not line.strip().lower() in ignore_headings
        )

        if is_heading:
            project = {"name": line}
            desc_lines = []
            j = i + 1
            while j < len(lines):
                desc_candidate = lines[j]
                # Stop at next heading (non-bullet, not in ignore list)
                next_is_heading = (
                    not re.match(r"^[-*•·]\s*", desc_candidate) and
                    not desc_candidate.strip().lower() in ignore_headings
                )
                if next_is_heading:
                    break
                # Accept bullet/dash or plain lines as description
                if re.match(r"^[-*•·]\s*", desc_candidate):
                    desc_line = re.sub(r"^[-*•·]\s*", "", desc_candidate)
                    desc_lines.append(desc_line)
                elif desc_candidate:
                    desc_lines.append(desc_candidate)
                j += 1

            if desc_lines:
                description = " ".join(desc_lines)
                project["description"] = description

                # Extract date/duration
                date_pattern = re.compile(
                    r"((Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}\s*[–\-to]+\s*(Present|\d{4})|"
                    r"\d{4}\s*[–\-to]+\s*(Present|\d{4})|"
                    r"(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4})",
                    re.IGNORECASE
                )
                date_match = date_pattern.search(description)
                project["date"] = date_match.group().strip() if date_match else None

                # Extract first link (http/https)
                link_match = re.search(r"https?://\S+", description)
                project["link"] = link_match.group().strip() if link_match else None
            else:
                project["description"] = None
                project["date"] = None
                project["link"] = None

            projects.append(project)
            i = j
        else:
            i += 1
    return projects
