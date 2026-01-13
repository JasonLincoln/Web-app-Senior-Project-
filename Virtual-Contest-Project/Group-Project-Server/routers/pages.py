import sys
import traceback
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, Path, Request
from passlib.context import CryptContext
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from starlette import status
from starlette.responses import RedirectResponse
from database import SessionLocal
from models import Users, UsersSkills, Skills, Sessions
from routers.auth import get_current_user
from routers.sessions import SessionsRequest
from fastapi.templating import Jinja2Templates

'''Connects the endpoints to FastAPI under the Users category'''
router = APIRouter(
    prefix = "/pages",
    tags = ['pages']
)

'''Connects to the database'''
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]
bcrypt_context = CryptContext(schemes = ['bcrypt'], deprecated = 'auto')
templates = Jinja2Templates(directory = "templates")

'''Redirects the user to the login page if not logged in'''
def redirect_to_login():
    redirect_response = RedirectResponse(url="../pages/login", status_code=status.HTTP_302_FOUND)
    redirect_response.delete_cookie(key = 'access_token')
    return redirect_response

@router.get('/admin-page')
async def render_admin_page(request: Request):
    try:
        user = await get_current_user(request.cookies.get('access_token'))
        if user is None:
            return redirect_to_login()
        return templates.TemplateResponse('admin.html', {'request': request, 'user': user})
    except:
        return redirect_to_login()

'''Renders the index page'''
@router.get('/index')
async def render_main_page(request: Request):
    try:
        user = await get_current_user(request.cookies.get('access_token'))
        if user is None:
            return redirect_to_login()
        return templates.TemplateResponse('index.html', {'request': request, 'user': user})
    except:
        return redirect_to_login()

'''Renders the tutor search page'''
@router.get('/explore')
async def render_search_page(request: Request):
    try:
        user = await get_current_user(request.cookies.get('access_token'))
        if user is None:
            return redirect_to_login()
        return templates.TemplateResponse('tutor_search.html', {'request': request, 'user': user})
    except:
        return redirect_to_login()

'''Renders the login page'''
@router.get('/login')
def render_login_page(request: Request):
    return templates.TemplateResponse('login.html', {'request': request})

'''Renders the register page'''
@router.get('/register')
def render_register_page(request: Request):
    return templates.TemplateResponse('signup.html', {'request': request})

'''Renders the forgot password page'''
@router.get('/forgot-password')
def render_forgot_password_page(request: Request):
    return templates.TemplateResponse('update_password.html', {'request': request})

'''Renders the about_us page'''
@router.get('/about-us')
async def render_about_us_page(request: Request):
    try:
        user = await get_current_user(request.cookies.get('access_token'))
        if user is None:
            return redirect_to_login()
        return templates.TemplateResponse('about_us.html', {'request': request, 'user': user})
    except:
        return redirect_to_login()

'''Renders the credits page'''
@router.get('/credits')
async def render_credits_page(request: Request):
    try:
        user = await get_current_user(request.cookies.get('access_token'))
        if user is None:
            return redirect_to_login()
        return templates.TemplateResponse('credits.html', {'request': request, 'user': user})
    except:
        return redirect_to_login()

'''Renders the terms page'''
@router.get('/terms')
async def render_terms_page(request: Request):
    return templates.TemplateResponse('terms.html', {'request': request})

'''Renders the profile_creation page'''
@router.get('/profile-creation')
async def render_profile_creation_page(request: Request):
    try:
        user = await get_current_user(request.cookies.get('access_token'))
        if user is None:
            return redirect_to_login()
        return templates.TemplateResponse('profile_creation.html', {'request': request, 'user': user})
    except:
        return redirect_to_login()

'''Renders the rating page'''
@router.get('/rating/{username}')
async def render_rating_page(db: db_dependency, request: Request, username: str):
    user = db.query(Users).filter(username == Users.username).first()
    return templates.TemplateResponse('rating.html', {'request': request, 'user': user})

'''Renders the messages page'''
@router.get('/messages')
async def render_messages_page(request: Request):
    try:
        user = await get_current_user(request.cookies.get('access_token'))
        if user is None:
            return redirect_to_login()
        return templates.TemplateResponse('messages.html', {'request': request, 'user': user})
    except:
        return redirect_to_login()

'''Renders the profile page'''
@router.get('/profile/{user_id}')
def render_profile_page(request: Request, db: db_dependency, user_id: int):
    user = db.query(Users).filter(user_id == Users.id).first()
    return templates.TemplateResponse('profile.html', {'request': request, 'user': user})

@router.get('/sessions')
async def render_sessions_page(request: Request, db: db_dependency):
    try:
        user = await get_current_user(request.cookies.get('access_token'))
        if user is None:
            return redirect_to_login()
        return templates.TemplateResponse('sessions.html', {'request': request, 'user': user})
    except:
        return redirect_to_login()