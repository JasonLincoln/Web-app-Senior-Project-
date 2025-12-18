from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, Path, Request
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from starlette import status
from database import SessionLocal
from models import Users, Skills, UsersSkills, Achievements, Messages, Sessions
from routers.achievements import AchievementRequest
from routers.auth import get_current_user
from fastapi.templating import Jinja2Templates
from routers.sessions import SessionsRequest
from routers.skills import SkillRequest, UserSkillRequest

router = APIRouter(
    prefix = "/admin",
    tags = ["admin"]
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]
templates = Jinja2Templates(directory = "templates")

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

@router.get('/admin-page')
def render_admin_page(request: Request):
    return templates.TemplateResponse('admin.html', {'request': request})

'''gets all users'''
@router.get("/user", status_code=status.HTTP_200_OK)
async def get_all_users(db: db_dependency):
    # if user is None or user.get('user_role') != 'admin':
    #     raise HTTPException(status_code = 401, detail = "Authentication Failed")
    return db.query(Users).all()

'''gets a user by their id'''
@router.get('/by_id/{user_id}', status_code = status.HTTP_200_OK)
async def get_user_by_id(user: user_dependency, db: db_dependency, user_id: int = Path(gt = 0)):
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

'''gets all skills'''
@router.get("/skill", status_code = status.HTTP_200_OK)
async def get_all_skills(db: db_dependency):
    # if user is None or user.get('user_role') != 'admin':
    #     raise HTTPException(status_code = 401, detail = "Authentication Failed")
    return db.query(Skills).all()

'''gets a skill by it's id'''
@router.get('/by_id/{skill_id}', status_code = status.HTTP_200_OK)
async def get_skill_by_id(user: user_dependency, db: db_dependency, skill_id: int = Path(gt = 0)):
    if user is None or user.get('user_role') != 'admin':
        raise HTTPException(status_code = 401, detail = "Authentication Failed")
    skills_result = (db.query(Skills).filter(skill_id == Skills.id).first())
    if skills_result is not None:
        return skills_result
    raise HTTPException(status_code = 404, detail = 'Skill not found')

'''gets all achievements'''
@router.get("/Achievement", status_code = status.HTTP_200_OK)
async def get_all_achievements(db: db_dependency):
    # if user is None or user.get('user_role') != 'admin':
    #     raise HTTPException(status_code = 401, detail = "Authentication Failed")
    return db.query(Achievements).all()

'''gets a achievement by it's id'''
@router.get('/by_id/{achievement_id}', status_code = status.HTTP_200_OK)
async def get_achievement_by_id(user: user_dependency, db: db_dependency, achievement_id: int = Path(gt = 0)):
    if user is None or user.get('user_role') != 'admin':
        raise HTTPException(status_code = 401, detail = "Authentication Failed")
    achievements_result = (db.query(Achievements).filter(achievement_id == Achievements.id).first())
    if achievements_result is not None:
        return achievements_result
    raise HTTPException(status_code = 404, detail = 'Achievement not found')

'''gets all messages'''
@router.get("/Messages", status_code = status.HTTP_200_OK)
async def get_all_messages(db: db_dependency):
    # if user is None or user.get('user_role') != 'admin':
    #     raise HTTPException(status_code = 401, detail = "Authentication Failed")
    return db.query(Messages).all()

'''gets a message by it's id'''
@router.get('/by_id/{message_id}', status_code = status.HTTP_200_OK)
async def get_message_by_id(user: user_dependency, db: db_dependency, message_id: int = Path(gt = 0)):
    if user is None or user.get('user_role') != 'admin':
        raise HTTPException(status_code = 401, detail = "Authentication Failed")
    messages_result = (db.query(Messages).filter(message_id == Messages.id).first())
    if messages_result is not None:
        return messages_result
    raise HTTPException(status_code = 404, detail = 'Message not found')

'''gets all sessions'''
@router.get("/Sessions", status_code = status.HTTP_200_OK)
async def get_all_sessions(db: db_dependency):
    # if user is None or user.get('user_role') != 'admin':
    #     raise HTTPException(status_code = 401, detail = "Authentication Failed")
    return db.query(Sessions).all()

'''gets a session by it's id'''
@router.get('/by_id/{session_id}', status_code = status.HTTP_200_OK)
async def get_session_by_id(user: user_dependency, db: db_dependency, session_id: int = Path(gt = 0)):
    if user is None or user.get('user_role') != 'admin':
        raise HTTPException(status_code = 401, detail = "Authentication Failed")
    sessions_result = (db.query(Sessions).filter(session_id == Sessions.id).first())
    if sessions_result is not None:
        return sessions_result
    raise HTTPException(status_code = 404, detail = 'Session not found')

'''creates a new skill'''
@router.post('/create_skill', status_code = status.HTTP_201_CREATED)
async def create_skill(user: user_dependency, db: db_dependency, skill_request: SkillRequest):
    if user is None or user.get('user_role') != 'admin':
        raise HTTPException(status_code = 401, detail = "Authentication Failed")
    skill_model = Skills(**skill_request.model_dump())
    if skill_model is None:
        raise HTTPException(status_code = 404, detail = 'Skill not found')
    db.add(skill_model)
    db.commit()

'''creates a new achievement'''
@router.post('/create_achievement', status_code = status.HTTP_201_CREATED)
async def create_achievement(user: user_dependency, db: db_dependency, achievement_request: AchievementRequest):
    if user is None or user.get('user_role') != 'admin':
        raise HTTPException(status_code = 401, detail = "Authentication Failed")
    achievement_model = Achievements(**achievement_request.model_dump())
    if achievement_model is None:
        raise HTTPException(status_code = 404, detail = 'Achievement not found')
    db.add(achievement_model)
    db.commit()

'''Temp endpoint DELETE WHEN DONE'''
@router.post('/create_userskill', status_code = status.HTTP_201_CREATED)
async def create_skill(user: user_dependency, db: db_dependency, userskill_request: UserSkillRequest):
    if user is None or user.get('user_role') != 'admin':
        raise HTTPException(status_code = 401, detail = "Authentication Failed")
    user_skill_model = UsersSkills(**userskill_request.model_dump(), sender_id = user.get('id'))
    if user_skill_model is None:
        raise HTTPException(status_code = 404, detail = 'Skill not found')
    db.add(user_skill_model)
    db.commit()

@router.put('/{user_id}', status_code = status.HTTP_204_NO_CONTENT)
async def update_user(user: user_dependency, db: db_dependency, user_request: AdminUserRequest, user_id: int = Path(gt = 0)):
    if user is None or user.get('user_role') != 'admin':
        raise HTTPException(status_code = 401, detail = "Authentication Failed")
    user_model = (db.query(Users)
                   .filter(user_id == Users.id)
                   .first())
    if user_model is None:
        raise HTTPException(status_code = 404, detail = 'User not found')

    user_model.email = user_request.email
    user_model.display_name = user_request.display_name
    user_model.hashed_password = user_request.hashed_password
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
@router.put('/{skill_id}', status_code = status.HTTP_204_NO_CONTENT)
async def update_skill(user: user_dependency, db: db_dependency, skill_request: SkillRequest, skill_id: int = Path(gt = 0)):
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

@router.put('/{achievement_id}', status_code = status.HTTP_204_NO_CONTENT)
async def update_achievement(user: user_dependency, db: db_dependency, achievement_request: AchievementRequest, achievement_id: int = Path(gt = 0)):
    if user is None or user.get('user_role') != 'admin':
        raise HTTPException(status_code = 401, detail = "Authentication Failed")
    achievement_model = (db.query(Achievements)
                   .filter(achievement_id == Achievements.id)
                   .first())
    if achievement_model is None:
        raise HTTPException(status_code = 404, detail = 'Achievement not found')

    achievement_model.name = achievement_request.name
    achievement_model.description = achievement_request.description
    achievement_model.image_url = achievement_request.image_url

    db.add(achievement_model)
    db.commit()

@router.put('/{session_id}', status_code = status.HTTP_204_NO_CONTENT)
async def update_session(user: user_dependency, db: db_dependency, session_request: SessionsRequest, session_id: int = Path(gt = 0)):
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

'''deletes a user by their id'''
@router.delete('/user/{user_id}', status_code = status.HTTP_204_NO_CONTENT)
async def delete_user_by_id(user: user_dependency, db: db_dependency, user_id: int = Path(gt = 0)):
    if user is None or user.get('user_role' != 'admin'):
        raise HTTPException(status_code = 401, detail = "Authentication Failed")
    user_model = db.query(Users).filter(user_id == Users.id).first()
    if user_model is None:
        raise HTTPException(status_code = 404, detail = "User not found")
    db.query(Users).filter(user_id == Users.id).delete()
    db.commit()

'''deletes a skill by it's id'''
@router.delete('/skill/{skill_id}', status_code = status.HTTP_204_NO_CONTENT)
async def delete_skill_by_id(user: user_dependency, db: db_dependency, skill_id: int = Path(gt = 0)):
    if user is None or user.get('user_role' != 'admin'):
        raise HTTPException(status_code = 401, detail = "Authentication Failed")
    skill_model = db.query(Skills).filter(skill_id == Skills.id).first()
    if skill_model is None:
        raise HTTPException(status_code = 404, detail = "Skill not found")
    db.query(Users).filter(skill_id == Skills.id).delete()
    db.commit()

'''deletes a achievement by it's id'''
@router.delete('/achievement/{achievement_id}', status_code = status.HTTP_204_NO_CONTENT)
async def delete_achievement_by_id(user: user_dependency, db: db_dependency, achievement_id: int = Path(gt = 0)):
    if user is None or user.get('user_role' != 'admin'):
        raise HTTPException(status_code = 401, detail = "Authentication Failed")
    achievement_model = db.query(Achievements).filter(achievement_id == Achievements.id).first()
    if achievement_model is None:
        raise HTTPException(status_code = 404, detail = "Achievement not found")
    db.query(Users).filter(achievement_id == Achievements.id).delete()
    db.commit()

'''deletes a message by it's id'''
@router.delete('/message/{message_id}', status_code = status.HTTP_204_NO_CONTENT)
async def delete_message_by_id(user: user_dependency, db: db_dependency, message_id: int = Path(gt = 0)):
    if user is None or user.get('user_role' != 'admin'):
        raise HTTPException(status_code = 401, detail = "Authentication Failed")
    message_model = db.query(Messages).filter(message_id == Messages.id).first()
    if message_model is None:
        raise HTTPException(status_code = 404, detail = "Message not found")
    db.query(Users).filter(message_id == Messages.id).delete()
    db.commit()

'''deletes a session by it's id'''
@router.delete('/message/{message_id}', status_code = status.HTTP_204_NO_CONTENT)
async def delete_session_by_id(user: user_dependency, db: db_dependency, session_id: int = Path(gt = 0)):
    if user is None or user.get('user_role' != 'admin'):
        raise HTTPException(status_code = 401, detail = "Authentication Failed")
    session_model = db.query(Sessions).filter(session_id == Sessions.id).first()
    if session_model is None:
        raise HTTPException(status_code = 404, detail = "Session not found")
    db.query(Users).filter(session_id == Sessions.id).delete()
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

'''Renders the admin page'''
@router.get('/admin-page')
def render_admin_page(request: Request):
    return templates.TemplateResponse('admin.html', {'request': request})