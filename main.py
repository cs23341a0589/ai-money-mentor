from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fire import calculate_fire
from score import calculate_score
from chat import ai_chat

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {
        "status": "success",
        "message": "AI Money Mentor Running"
    }

@app.post("/fire")
def fire_plan(data: dict):
    try:
        return {
            "status": "success",
            "data": calculate_fire(data),
            "error": None
        }
    except Exception as e:
        return {
            "status": "error",
            "data": None,
            "error": str(e)
        }

@app.post("/score")
def score(data: dict):
    try:
        return {
            "status": "success",
            "data": calculate_score(data),
            "error": None
        }
    except Exception as e:
        return {
            "status": "error",
            "data": None,
            "error": str(e)
        }

@app.post("/chat")
def chat(data: dict):
    try:
        return {
            "status": "success",
            "data": ai_chat(data),
            "error": None
        }
    except Exception as e:
        return {
            "status": "error",
            "data": None,
            "error": str(e)
        }