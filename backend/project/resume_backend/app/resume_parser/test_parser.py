from pyresparser import ResumeParser

data = ResumeParser('Documents\resume sample').get_extracted_data()
print(data)
