from fastapi import FastAPI
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
import models
from database import engine
from routers import users, auth, admin, skills, messages, achievements, sessions

'''Connects the endpoints from each router to FastAPI'''
app = FastAPI()
app.include_router(users.router)
app.include_router(auth.router)
app.include_router(admin.router)
app.include_router(skills.router)
app.include_router(messages.router)
app.include_router(achievements.router)
app.include_router(sessions.router)

models.Base.metadata.create_all(bind = engine)

'''Allows webpage templating to reduce repetition'''
templates = Jinja2Templates(directory = "templates")
app.mount("/static", StaticFiles(directory = "static"), name = "static")
