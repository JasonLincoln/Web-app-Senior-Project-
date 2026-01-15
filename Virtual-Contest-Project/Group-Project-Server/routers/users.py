from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, Path, Request
from passlib.context import CryptContext
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from starlette import status
from database import SessionLocal
from models import Users, UsersSkills, Skills, Sessions
from routers.auth import get_current_user
from routers.sessions import SessionsRequest

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

'''Connects to the database'''
db_dependency = Annotated[Session, Depends(get_db)]

'''Grabs the logged in user'''
user_dependency = Annotated[dict, Depends(get_current_user)]

'''Encrypts the user's password with hashing'''
bcrypt_context = CryptContext(schemes = ['bcrypt'], deprecated = 'auto')

'''The model for verifying the user's password'''
class UserVerification(BaseModel):
    password: str
    new_password: str = Field(min_length = 8)

class UserRequest(BaseModel):
    display_name: str = Field(min_length = 1, max_length = 100)
    pronouns: str = Field(min_length = 1, max_length = 100)
    biography: str = Field(min_length = 1, max_length = 100)
    profile_url: str = Field(min_length = 1, max_length = 300)

'''Authorization endpoints'''

'''Gets the logged in user'''
@router.get('/', status_code = status.HTTP_200_OK)
async def get_user(request: Request, db: db_dependency):
    user = await get_current_user(request.cookies.get('access_token'))
    if user is None:
        raise HTTPException(status_code = 401, detail = 'Authentication Failed')
    return db.query(Users).filter(user.get('id') == Users.id).first()

'''gets all users'''
@router.get("/all_users", status_code=status.HTTP_200_OK)
async def get_all_users(request: Request, db: db_dependency):
    user = await get_current_user(request.cookies.get('access_token'))
    if user is None:
        raise HTTPException(status_code = 401, detail = "Authentication Failed")
    return db.query(Users).all()

'''Changes the password of the current user'''
@router.put('/password', status_code = status.HTTP_204_NO_CONTENT)
async def change_password(request: Request, db: db_dependency,
                          user_verification: UserVerification):

    user = await get_current_user(request.cookies.get('access_token'))
    if user is None:
        raise HTTPException(status_code = 401, detail = 'Authentication Failed')
    user_model = db.query(Users).filter(user.get('id') == Users.id).first()

    if not bcrypt_context.verify(user_verification.password, user_model.hashed_password):
        raise HTTPException(status_code = 401, detail = 'Error on password change')

    user_model.hashed_password = bcrypt_context.hash(user_verification.new_password)
    db.add(user_model)
    db.commit()

'''Updates the information of a user'''
@router.put('/update_user', status_code = status.HTTP_204_NO_CONTENT)
async def update_user(user: user_dependency,db: db_dependency,user_request: UserRequest):
    if user is None:
        raise HTTPException(status_code = 401, detail = "Authentication Failed")
    user_model = db.query(Users).filter(user.get('id') == Users.id).first()

    if user_model is None:
        raise HTTPException(status_code = 404, detail = 'User not found')

    user_model.display_name = user_request.display_name
    user_model.pronouns = user_request.pronouns
    user_model.biography = user_request.biography
    user_model.profile_url = user_request.profile_url

    db.add(user_model)
    db.commit()

'''Standard endpoints'''

'''Queries for a user with a certain username'''
@router.get('/by_username/{username}', status_code = status.HTTP_200_OK)
async def get_user_by_username(db: db_dependency, username: str = Path(min_length = 1)):
    user = await get_current_user(request.cookies.get('access_token'))
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
    users_result = (db.query(UsersSkills).filter(user_id == UsersSkills.user_id).join(Skills, Skills.id == UsersSkills.skill_id).all())
    if users_result is not None:
        return users_result
    raise HTTPException(status_code = 404, detail = 'User not found')

'''Queries for all users with a certain rating'''
@router.get('/by_rating/{rating}', status_code = status.HTTP_200_OK)
async def get_users_by_rating(user: user_dependency, db: db_dependency, rating: int = Path(gt = 0)):
    if user is None:
        raise HTTPException(status_code = 401, detail = "Authentication Failed")
    rating_result = (db.query(Users).filter(rating == Users.rating).all())
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

