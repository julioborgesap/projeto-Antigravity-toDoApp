from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
import models

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Todo Dashboard API",
    description="Backend API for the Todo Dashboard application",
    version="1.0.0"
)

# Configure CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For development, we allow all
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Todo Dashboard API is running"}

from routes import auth, tasks, dashboard

app.include_router(auth.router)
app.include_router(tasks.router)
app.include_router(dashboard.router)
