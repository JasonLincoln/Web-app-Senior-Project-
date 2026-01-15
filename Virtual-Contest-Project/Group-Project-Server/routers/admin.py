from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, Path, Request
from passlib.context import CryptContext
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from starlette import status
from database import SessionLocal
from models import Users, Skills, Messages, Sessions, Audits, Ratings
from routers.auth import get_current_user
from routers.sessions import SessionsRequest
from routers.skills import SkillRequest

'''Defines the router for the admin page'''
router = APIRouter(
    prefix = "/admin",
    tags = ["admin"]
)

'''Grabs the database'''
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

'''Grabs the database'''
db_dependency = Annotated[Session, Depends(get_db)]

'''Grabs the logged in user'''
user_dependency = Annotated[dict, Depends(get_current_user)]

'''Hashes passwords'''
bcrypt_context = CryptContext(schemes=['bcrypt'], deprecated='auto')

'''The request model for is a user is being updated'''
class AdminUserRequest(BaseModel):
    email: str = Field(min_length = 1, max_length = 100)
    display_name: str = Field(min_length = 1, max_length = 100)
    hashed_password: str = Field(min_length = 1, max_length = 100)
    rating: float = Field(gt = 0)
    pronouns: str = Field(min_length = 1, max_length = 100)
    gender: str = Field(min_length = 1, max_length = 100)
    biography: str = Field(min_length = 1, max_length = 100)
    profile_url: str = Field(min_length = 1, max_length = 100)
    role: str = Field(min_length = 1, max_length = 100)
    is_active: bool = Field(default = True)

'''gets all users if the user logged in is an admin'''
@router.get("/user", status_code=status.HTTP_200_OK)
async def get_all_users(request: Request, db: db_dependency):
    user = await get_current_user(request.cookies.get('access_token'))
    if user is None or user.get('user_role') != 'admin':
        raise HTTPException(status_code = 401, detail = "Authentication Failed")
    return db.query(Users).all()

'''gets a user by their id if the user logged in is an admin'''
@router.get('/by_user_id/{user_id}', status_code = status.HTTP_200_OK)
async def get_user_by_id(request: Request, db: db_dependency, user_id: int = Path(gt = 0)):
    user = await get_current_user(request.cookies.get('access_token'))
    if user is None or user.get('user_role') != 'admin':
        raise HTTPException(status_code = 401, detail = "Authentication Failed")
    users_result = (db.query(Users).filter(user_id == Users.id).first())
    if users_result is not None:
        return users_result
    raise HTTPException(status_code = 404, detail = 'User not found')

'''Need to check if this is needed or if we are fine with just id'''

# @router.get('/by_username/{user_username}', status_code = status.HTTP_200_OK)
# async def get_user_by_username(user: user_dependency, db: db_dependency, user_username: str = Path(min_length = 1)):
#     if user is None or user.get('user_role') != 'admin':
#         raise HTTPException(status_code=401, detail = "Authentication Failed")
#     users_result = (db.query(Users).filter(Users.username == user_username).first())
#     if users_result is not None:
#         return users_result
#     raise HTTPException(status_code = 404, detail = 'User not found')

'''gets all skills if the user logged in is an admin'''
@router.get("/skill", status_code = status.HTTP_200_OK)
async def get_all_skills(request: Request, db: db_dependency):
    user = await get_current_user(request.cookies.get('access_token'))
    if user is None or user.get('user_role') != 'admin':
        raise HTTPException(status_code = 401, detail = "Authentication Failed")
    return db.query(Skills).all()

'''gets a skill by it's id if the user logged in is an admin'''
@router.get('/by_skill_id/{skill_id}', status_code = status.HTTP_200_OK)
async def get_skill_by_id(request: Request, db: db_dependency, skill_id: int = Path(gt = 0)):
    user = await get_current_user(request.cookies.get('access_token'))
    if user is None or user.get('user_role') != 'admin':
        raise HTTPException(status_code = 401, detail = "Authentication Failed")
    skills_result = (db.query(Skills).filter(skill_id == Skills.id).first())
    if skills_result is not None:
        return skills_result
    raise HTTPException(status_code = 404, detail = 'Skill not found')

'''gets all messages if the user logged in is an admin'''
@router.get("/Messages", status_code = status.HTTP_200_OK)
async def get_all_messages(request: Request, db: db_dependency):
    user = await get_current_user(request.cookies.get('access_token'))
    if user is None or user.get('user_role') != 'admin':
        raise HTTPException(status_code = 401, detail = "Authentication Failed")
    return db.query(Messages).all()

'''gets a message by it's id if the user logged in is an admin'''
@router.get('/by_message_id/{message_id}', status_code = status.HTTP_200_OK)
async def get_message_by_id(request: Request, db: db_dependency, message_id: int = Path(gt = 0)):
    user = await get_current_user(request.cookies.get('access_token'))
    if user is None or user.get('user_role') != 'admin':
        raise HTTPException(status_code = 401, detail = "Authentication Failed")
    messages_result = (db.query(Messages).filter(message_id == Messages.id).first())
    if messages_result is not None:
        return messages_result
    raise HTTPException(status_code = 404, detail = 'Message not found')

'''gets all sessions if the user logged in is an admin'''
@router.get("/Sessions", status_code = status.HTTP_200_OK)
async def get_all_sessions(request: Request, db: db_dependency):
    user = await get_current_user(request.cookies.get('access_token'))
    if user is None or user.get('user_role') != 'admin':
        raise HTTPException(status_code = 401, detail = "Authentication Failed")
    return db.query(Sessions).all()

'''gets a session by it's id if the user logged in is an admin'''
@router.get('/by_session_id/{session_id}', status_code = status.HTTP_200_OK)
async def get_session_by_id(request: Request, db: db_dependency, session_id: int = Path(gt = 0)):
    user = await get_current_user(request.cookies.get('access_token'))
    if user is None or user.get('user_role') != 'admin':
        raise HTTPException(status_code = 401, detail = "Authentication Failed")
    sessions_result = (db.query(Sessions).filter(session_id == Sessions.id).first())
    if sessions_result is not None:
        return sessions_result
    raise HTTPException(status_code = 404, detail = 'Session not found')

'''gets all audits if the user logged in is an admin'''
@router.get("/audits", status_code = status.HTTP_200_OK)
async def get_all_audits(request: Request, db: db_dependency):
    user = await get_current_user(request.cookies.get('access_token'))
    if user is None or user.get('user_role') != 'admin':
        raise HTTPException(status_code = 401, detail = "Authentication Failed")
    return db.query(Audits).all()

'''gets an audit by it's id if the user logged in is an admin'''
@router.get('/by_audit_id/{audit_id}', status_code = status.HTTP_200_OK)
async def get_audit_by_id(request: Request, db: db_dependency, audit_id: int = Path(gt = 0)):
    user = await get_current_user(request.cookies.get('access_token'))
    if user is None or user.get('user_role') != 'admin':
        raise HTTPException(status_code = 401, detail = "Authentication Failed")
    audit_result = (db.query(Audits).filter(audit_id == Audits.id).first())
    if audit_result is not None:
        return audit_result
    raise HTTPException(status_code = 404, detail = 'Audit not found')

'''gets all ratings if the user logged in is an admin'''
@router.get("/ratings", status_code = status.HTTP_200_OK)
async def get_all_ratings(request: Request, db: db_dependency):
    user = await get_current_user(request.cookies.get('access_token'))
    if user is None or user.get('user_role') != 'admin':
        raise HTTPException(status_code = 401, detail = "Authentication Failed")
    return db.query(Ratings).all()

'''gets a rating by it's id if the user logged in is an admin'''
@router.get('/by_rating_id/{rating_id}', status_code = status.HTTP_200_OK)
async def get_rating_by_id(request: Request, db: db_dependency, rating_id: int = Path(gt = 0)):
    user = await get_current_user(request.cookies.get('access_token'))
    if user is None or user.get('user_role') != 'admin':
        raise HTTPException(status_code = 401, detail = "Authentication Failed")
    ratings_result = (db.query(Ratings).filter(rating_id == Ratings.id).first())
    if ratings_result is not None:
        return ratings_result
    raise HTTPException(status_code = 404, detail = 'Audit not found')

'''creates a new skill if the user logged in is an admin'''
@router.post('/create_skill', status_code = status.HTTP_201_CREATED)
async def create_skill(request: Request, db: db_dependency, skill_request: SkillRequest):
    user = await get_current_user(request.cookies.get('access_token'))
    if user is None or user.get('user_role') != 'admin':
        raise HTTPException(status_code = 401, detail = "Authentication Failed")
    skill_model = Skills(**skill_request.model_dump())
    if skill_model is None:
        raise HTTPException(status_code = 404, detail = 'Skill not found')
    db.add(skill_model)
    db.commit()

@router.put('/update_user/{user_id}', status_code = status.HTTP_204_NO_CONTENT)
async def update_user(request: Request, db: db_dependency, user_request: AdminUserRequest, user_id: int = Path(gt = 0)):
    user = await get_current_user(request.cookies.get('access_token'))
    if user is None or user.get('user_role') != 'admin':
        raise HTTPException(status_code = 401, detail = "Authentication Failed")
    user_model = (db.query(Users)
                   .filter(user_id == Users.id)
                   .first())
    if user_model is None:
        raise HTTPException(status_code = 404, detail = 'User not found')

    user_model.email = user_request.email
    user_model.display_name = user_request.display_name
    user_model.hashed_password = bcrypt_context.hash(user_request.hashed_password),
    user_model.rating = user_request.rating
    user_model.pronouns = user_request.pronouns
    user_model.gender = user_request.gender
    user_model.biography = user_request.biography
    user_model.profile_url = user_request.profile_url
    user_model.role = user_request.role
    user_model.is_active = user_request.is_active

    db.add(user_model)
    db.commit()

'''TO DO fix update endpoints bellow. Wants the field from user for some reason. Should be the problem'''
@router.put('/update_skill/{skill_id}', status_code = status.HTTP_204_NO_CONTENT)
async def update_skill(request: Request, db: db_dependency, skill_request: SkillRequest, skill_id: int = Path(gt = 0)):
    user = await get_current_user(request.cookies.get('access_token'))
    if user is None or user.get('user_role') != 'admin':
        raise HTTPException(status_code = 401, detail = "Authentication Failed")
    skill_model = (db.query(Skills)
                   .filter(skill_id == Skills.id)
                   .first())
    if skill_model is None:
        raise HTTPException(status_code = 404, detail = 'Skill not found')

    skill_model.super_category = skill_request.super_category
    skill_model.sub_category = skill_request.sub_category

    db.add(skill_model)
    db.commit()

@router.put('/update_session/{session_id}', status_code = status.HTTP_204_NO_CONTENT)
async def update_session(request: Request, db: db_dependency, session_request: SessionsRequest, session_id: int = Path(gt = 0)):
    user = await get_current_user(request.cookies.get('access_token'))
    if user is None or user.get('user_role') != 'admin':
        raise HTTPException(status_code = 401, detail = "Authentication Failed")
    session_model = (db.query(Sessions)
                   .filter(session_id == Sessions.id)
                   .first())
    if session_model is None:
        raise HTTPException(status_code = 404, detail = 'Session not found')

    session_model.session_date = session_request.session_date

    db.add(session_model)
    db.commit()

'''deletes a user by their id if the user logged in is an admin'''
@router.delete('/user/{user_id}', status_code = status.HTTP_204_NO_CONTENT)
async def delete_user_by_id(request: Request, db: db_dependency, user_id: int = Path(gt = 0)):
    user = await get_current_user(request.cookies.get('access_token'))
    if user is None or user.get('user_role') != 'admin':
        raise HTTPException(status_code = 401, detail = "Authentication Failed")
    user_model = db.query(Users).filter(user_id == Users.id).first()
    if user_model is None:
        raise HTTPException(status_code = 404, detail = "User not found")
    db.delete(user_model)
    db.commit()

'''deletes a skill by it's id if the user logged in is an admin'''
@router.delete('/skill/{skill_id}', status_code = status.HTTP_204_NO_CONTENT)
async def delete_skill_by_id(request: Request, db: db_dependency, skill_id: int = Path(gt = 0)):
    user = await get_current_user(request.cookies.get('access_token'))
    if user is None or user.get('user_role') != 'admin':
        raise HTTPException(status_code = 401, detail = "Authentication Failed")
    skill_model = db.query(Skills).filter(skill_id == Skills.id).first()
    if skill_model is None:
        raise HTTPException(status_code = 404, detail = "Skill not found")
    db.query(Skills).filter(skill_id == Skills.id).delete()
    db.commit()

'''deletes a message by it's id if the user logged in is an admin'''
@router.delete('/message/{message_id}', status_code = status.HTTP_204_NO_CONTENT)
async def delete_message_by_id(request: Request, db: db_dependency, message_id: int = Path(gt = 0)):
    user = await get_current_user(request.cookies.get('access_token'))
    if user is None or user.get('user_role') != 'admin':
        raise HTTPException(status_code = 401, detail = "Authentication Failed")
    message_model = db.query(Messages).filter(message_id == Messages.id).first()
    if message_model is None:
        raise HTTPException(status_code = 404, detail = "Message not found")
    db.query(Messages).filter(message_id == Messages.id).delete()
    db.commit()

'''deletes a session by it's id if the user logged in is an admin'''
@router.delete('/session/{session_id}', status_code = status.HTTP_204_NO_CONTENT)
async def delete_session_by_id(request: Request, db: db_dependency, session_id: int = Path(gt = 0)):
    user = await get_current_user(request.cookies.get('access_token'))
    if user is None or user.get('user_role') != 'admin':
        raise HTTPException(status_code = 401, detail = "Authentication Failed")
    session_model = db.query(Sessions).filter(session_id == Sessions.id).first()
    if session_model is None:
        raise HTTPException(status_code = 404, detail = "Session not found")
    db.query(Sessions).filter(session_id == Sessions.id).delete()
    db.commit()

'''Need to check if this is needed or if we are fine with just id'''
# @router.delete('/by_username/{user_username}', status_code = status.HTTP_204_NO_CONTENT)
# async def delete_user(user: user_dependency, db: db_dependency, user_username: str = Path(min_length = 1)):
#     if user is None or user.get('user_role' != 'admin'):
#         raise HTTPException(status_code = 401, detail = "Authentication Failed")
#     user_model = db.query(Users).filter(Users.username == user_username).first()
#     if user_model is None:
#         raise HTTPException(status_code = 404, detail = "User not found")
#     db.query(Users).filter(Users.username == user_username).delete()
#     db.commit()