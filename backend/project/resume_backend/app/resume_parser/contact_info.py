import re, spacy

# ------------------------ Personal Info Extraction -------------------------------------------------

#________________________________________email extraction________________________
def extract_email(text):
    email_match = re.search(r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+", text)
    return email_match.group() if email_match else None



#________________________________________phone extraction_______________________
def extract_phone(text):
    phone_match = re.search(
        r'(\+?\d{1,3}[-.\s]?)?(\(?\d{2,4}\)?[-.\s]?){2,4}\d{3,4}', text)
    return phone_match.group() if phone_match else None



#________________________________________name extraction_________________________
def extract_name(text):
    lines = [line.strip() for line in text.strip().split('\n') if line.strip()]
    # Only look at the first 10 lines
    lines = lines[:10]
    skip_keywords = {"resume", "curriculum", "skills", "objective", "summary", "profile", "contact", "email", "phone", "address"}
    for line in lines:
        if line.endswith(":"):
            continue
        if any(kw in line.lower() for kw in skip_keywords):
            continue
        words = line.strip().split()
        if (
            len(words) >= 2
            and all(word.istitle() or word.isupper() for word in words)
            and not any(char.isdigit() for char in line)
            and len(line) < 40
        ):
            return " ".join(words)
    return None

#------------------------------------------------------
def fallback_extract_name(text):
    nlp = spacy.load("en_core_web_sm")
    doc = nlp(text)
    for ent in doc.ents:
        if ent.label_ == "PERSON":
            return ent.text
    return None
#-----------------------------------------------------------



#_________________________address extraction_____________________________________
def extract_address(text):
    # Prefer lines that look like an address
    for line in text.split('\n'):
        if line.strip().lower().startswith("address:"):
            return line.strip()
        if re.search(r"\d{1,5} .+(road|street|avenue|block|sector|lane|colony|nagar|park)", line, re.IGNORECASE):
            return line.strip()
    # Fallback to spaCy NER
    nlp = spacy.load("en_core_web_sm")
    doc = nlp(text)
    locations = [ent.text for ent in doc.ents if ent.label_ in ["GPE", "LOC"]]
    for loc in locations:
        if any(char.isdigit() for char in loc) or ',' in loc:
            return loc
    return locations[0] if locations else None

