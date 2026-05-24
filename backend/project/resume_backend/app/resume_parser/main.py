from .parser_main import *
# from .parser import parse_resume

from fastapi import FastAPI, UploadFile, File
# from app.parser import parse_resume  # Adjust the path if needed

app = FastAPI()

@app.post("/upload-resume/")
async def upload_resume(file: UploadFile = File(...)):
    contents = await file.read()
    result = parse_resume(file.filename, contents)
    return {"parsed_resume": result}


# from fastapi import FastAPI, UploadFile, File
# from parser import parse_resume

# app = FastAPI()

# @app.post("/upload_resume/")
# async def upload_resume(file: UploadFile = File(...)):
#     content = await file.read()
#     parsed_data = parse_resume(file.filename, content)
#     return parsed_data
