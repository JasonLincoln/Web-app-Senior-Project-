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
    prefix = "/users",
    tags = ['users']
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
    redirect_response = RedirectResponse(url="../auth/login-page", status_code=status.HTTP_302_FOUND)
    redirect_response.delete_cookie(key = 'access_token')
    return redirect_response

# '''Renders the Users Page. TEMP ENDPOINT'''
# @router.get('/users-page')
# async def render_users (request: Request, db: db_dependency):
#     try:
#         user = await get_current_user(request.cookies.get('access_token'))
#         if user is None:
#             return redirect_to_login()
#         users = db.query(Users).all()
#         return templates.TemplateResponse('users.html', {'request': request, 'users': users, 'user': user})
#     except:
#         print(sys.exc_info())
#         print(traceback.format_exc())
#         return redirect_to_login()

'''Renders the main page'''
@router.get('/main-page')
async def render_main_page(request: Request):
    try:
        user = await get_current_user(request.cookies.get('access_token'))
        if user is None:
            return redirect_to_login()
        return templates.TemplateResponse('index.html', {'request': request})
    except:
        return redirect_to_login()

class UserVerification(BaseModel):
    password: str
    new_password: str = Field(min_length = 6)

'''Authorization endpoints'''

'''Gets the logged in user'''
@router.get('/', status_code = status.HTTP_200_OK)
async def get_user(user: user_dependency, db: db_dependency):
    if user is None:
        raise HTTPException(status_code = 401, detail = 'Authentication Failed')
    return db.query(Users).filter(user.get('id') == Users.id).first()

'''Changes the password of the current user'''
@router.put('/password', status_code = status.HTTP_204_NO_CONTENT)
async def change_password(user: user_dependency, db: db_dependency,
                          user_verification: UserVerification):
    if user is None:
        raise HTTPException(status_code = 401, detail = 'Authentication Failed')
    user_model = db.query(Users).filter(user.get('id') == Users.id).first()

    if not bcrypt_context.verify(user_verification.password, user_model.hashed_password):
        raise HTTPException(status_code = 401, detail = 'Error on password change')

    user_model.hashed_password = bcrypt_context.hash(user_verification.new_password)
    db.add(user_model)
    db.commit()

'''Standard endpoints'''

class UserRequest(BaseModel):
    email: str = Field(min_length = 1, max_length = 100)
    display_name: str = Field(min_length = 1, max_length = 100)
    pronouns: str = Field(min_length = 1, max_length = 100)
    gender: str = Field(min_length = 1, max_length = 100)
    biography: str = Field(min_length = 1, max_length = 100)

'''Queries for a user with a certain username'''
@router.get('/by_username/{username}', status_code = status.HTTP_200_OK)
async def get_user_by_username(user: user_dependency, db: db_dependency, username: str = Path(min_length = 1)):
    if user is None:
        raise HTTPException(status_code = 401, detail = "Authentication Failed")
    username_result = (db.query(Users)
                      .filter(username == Users.username)
                      .first())
    if username_result is not None:
        return username_result
    raise HTTPException(status_code = 404, detail = 'User not found')

'''Queries for all users who have a specific skill'''
@router.get('/by_skill/{skill_id}', status_code = status.HTTP_200_OK)
async def get_users_by_skill(user: user_dependency, db: db_dependency, skill_id: int = Path(gt = 0)):
    if user is None:
        raise HTTPException(status_code = 401, detail = "Authentication Failed")
    users_result = (db.query(UsersSkills)
                    .filter(skill_id == UsersSkills.skill_id)
                    .join(Users, Users.id == UsersSkills.user_id)
                    .all())
    if users_result is not None:
        return users_result
    raise HTTPException(status_code = 404, detail = 'User not found')

'''Queries for all skills a user has'''
@router.get('/by_user/{user_id}', status_code = status.HTTP_200_OK)
async def get_skills_by_user(user: user_dependency, db: db_dependency, user_id: int = Path(gt = 0)):
    if user is None:
        raise HTTPException(status_code = 401, detail = "Authentication Failed")
    users_result = (db.query(UsersSkills)
                    .filter(user_id == UsersSkills.user_id)
                    .join(Skills, Skills.id == UsersSkills.skill_id)
                    .all())
    if users_result is not None:
        return users_result
    raise HTTPException(status_code = 404, detail = 'User not found')

'''Queries for all users with a certain rating'''
@router.get('/by_rating/{rating}', status_code = status.HTTP_200_OK)
async def get_users_by_rating(user: user_dependency, db: db_dependency, rating: int = Path(gt = 0)):
    if user is None:
        raise HTTPException(status_code = 401, detail = "Authentication Failed")
    rating_result = (db.query(Users)
                      .filter(rating == Users.rating)
                      .all())
    if rating_result is not None:
        return rating_result
    raise HTTPException(status_code = 404, detail = 'User not found')

'''Create a session between two users'''
@router.post('/create_session', status_code = status.HTTP_201_CREATED)
async def create_session(user: user_dependency, db: db_dependency, session_request: SessionsRequest):
    if user is None:
        raise HTTPException(status_code = 401, detail = "Authentication Failed")
    session_model = Sessions(**session_request.model_dump())
    if session_model is None:
        raise HTTPException(status_code = 404, detail = 'Session not found')
    db.add(session_model)
    db.commit()

'''Updates the information of a user'''
@router.put('/{user_id}', status_code = status.HTTP_204_NO_CONTENT)
async def update_user(user: user_dependency,
                       db: db_dependency,
                       user_request: UserRequest,
                       user_id: int = Path(gt = 0)):
    if user is None:
        raise HTTPException(status_code = 401, detail = "Authentication Failed")

    user_model = (db.query(Users)
                   .filter(user_id == Users.id)
                   .first())

    if user_model is None:
        raise HTTPException(status_code = 404, detail = 'User not found')

    user_model.email = user_request.email
    user_model.display_name = user_request.display_name
    user_model.pronouns = user_request.pronouns
    user_model.gender = user_request.gender
    user_model.biography = user_request.biography

    db.add(user_model)
    db.commit()