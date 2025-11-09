from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
from pydantic import BaseModel
import requests
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
import uvicorn

load_dotenv()

os.environ['GOOGLE_API_KEY'] = os.getenv("GOOGLE_API_KEY")

app = FastAPI(title="Project-Exhibition")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def getDetails():
    res = requests.get("http://localhost:8000/api/projects/getDetails")
    data = res.json()
    return data.get("details", [])

class CompareRequest(BaseModel):
    title: str
    description: str
    tools: list[str]
    projectType: str

@app.post("/api/compare")
def compare(body: CompareRequest):
    title = body.title
    description = body.description
    tools = body.tools
    projectType = body.projectType
    detail = {
        "title": title,
        "description": description,
        "tools": tools,
        "projectType": projectType
    }
    data = getDetails()
    data = [
        d for d in data
        if d.get("title", "") != title
        or d.get("description", "") != description
    ]
    llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0.0)

    template = """
You are a highly skilled AI evaluator that analyzes and compares software projects in depth.
Your task is to carefully study the first project’s details and compare it with all other projects.

Each project is described by: 
- Title  
- Description  
- Tools/Technologies used  
- Project Type  

You must compare **concepts, functionality, and purpose**, not just keywords or text similarity.

---

### Project to Compare:
{detail}

### Other Projects:
{data}

---

### Your Task:
1. Carefully compare the main project with each of the other projects.
2. Focus on *actual similarity of the idea or implementation*, not just shared words or tools.
3. If two projects solve similar problems or have overlapping functionality, mark them as highly similar.
4. If they use similar technologies but solve different problems, mark them as moderately similar.
5. If they are completely unrelated (different purpose, problem, and approach), mark them as low similarity.

Finally, estimate an **overall similarity percentage (0–100)** for how closely the first project resembles the others.
Return only the comparison number with every project - no explanation, no extra text but also write the first project vs every project the write the output.
"""


    prompt = ChatPromptTemplate.from_template(template)

    chain = prompt | llm

    response = chain.invoke({"detail": detail, "data": data})

    final_answer = response.content

    return {"result":final_answer}


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=9000, reload=True)
