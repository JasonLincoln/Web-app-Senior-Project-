from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
import models
from database import engine
from routers import users, auth, admin, skills, messages, sessions, pages, audits, ratings
from routers.config import settings
from fastapi import FastAPI

'''Defines the FastAPI app'''
app = FastAPI()

#settings for env variables
@app.get("/info")
async def info():
    return {
        "database_url": settings.database_url
    }

'''Connects the endpoints from each router to FastAPI'''
app = FastAPI()
app.include_router(users.router)
app.include_router(auth.router)
app.include_router(admin.router)
app.include_router(skills.router)
app.include_router(messages.router)
app.include_router(ratings.router)
app.include_router(sessions.router)
app.include_router(audits.router)
app.include_router(pages.router)

models.Base.metadata.create_all(bind = engine)

'''Allows webpage templating to reduce repetition'''
templates = Jinja2Templates(directory = "templates")
app.mount("/static", StaticFiles(directory = "static"), name = "static")