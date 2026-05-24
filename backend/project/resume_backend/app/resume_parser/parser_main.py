from .io_utlis import *
from .contact_info import *
from .experience import *
from .section_utils import *
from .education import *
from .skills import *
from .projects import extract_projects




#__________________________Main function___________________________________

def parse_resume(filename, file_bytes):
    if filename.endswith(".pdf"):
        raw_text = extract_text_from_pdf(file_bytes)
        sections = extract_sections(raw_text)
        education = clean_education(sections.get("education", ""))
        # Merge all experience-related sections

        
        
        experience_section_keys = [
        "experience", "work history", "professional experience", "employment history",
        "career history", "career experience", "work experience", "job history", "job experience",
        "work", "professional", "career", "employment", "experience summary",
        "career summary", "career objective"
        ]
        normalized_keys = [normalize_header(k) for k in experience_section_keys]
        experience_text = get_merged_section(sections, normalized_keys)
        experience = clean_experience(experience_text or "")
        skills = extract_all_resume_skills(sections)



    #_________________________________________________________________________________________
    elif filename.endswith(".docx"):
        raw_text = extract_text_from_docx(file_bytes)
        sections = extract_sections(raw_text)
        education = docx_clean_education([line.strip() for line in sections.get("education", "").splitlines() if line.strip()])
        # For skills, use the improved function
        skills = extract_skills_from_docx(sections)

    #    # 1. Try table extraction
    #     experience = extract_experience_from_docx_tables(file_bytes)
    #     # 2. Fallback: extract from paragraphs/sideheadings
    #     if not experience:
    #         exp_block = extract_experience_block_from_sections(sections)
    #         experience = clean_experience_block(exp_block)
    #     # 3. Fallback: extract from raw text (handles messy headers like SKILLS between jobs)
    #     if not experience:
    #         experience = extract_experience_blocks_flexible(raw_text)

        print("Trying: extract_experience_from_docx_tables")
        experience = extract_experience_from_docx_tables(file_bytes)

        if not experience:
            print("Fallback to: extract_experience_block_from_sections + clean_experience_block")
            exp_block = extract_experience_block_from_sections(sections)
            experience = clean_experience_block(exp_block)

        if not experience:
            print("Fallback to: extract_experience_blocks_flexible")
            experience = extract_experience_blocks_flexible(raw_text)

        if not experience:
            print("Failed to extract experience from any method.")




    #_______________________________________________________________________________________
    name = extract_name(raw_text)
    if not name:
        name = fallback_extract_name(raw_text)
    email = extract_email(raw_text)
    phone = extract_phone(raw_text)
    address = extract_address(raw_text)
    # education = extract_education(raw_text)
    # experience = extract_experience(raw_text)
    
    projects = extract_projects(sections)
    

    return {
        "name": name,
        "email": email,
        "phone": phone,
        "address": address,
        "education": education,
        "experience": experience,
        # "education": education,
        # "experience": experience,
        "skills_found": skills,
        "projects": projects,
        "resume_text": raw_text# limit output for preview
    }
