from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, Path, Request
from passlib.context import CryptContext
from pydantic import BaseModel, Field
from sqlalchemy import and_
from sqlalchemy.orm import Session
from starlette import status
from database import SessionLocal
from models import Skills, UsersSkills
from routers.auth import get_current_user

router = APIRouter(
    prefix="/skills",
    tags=['skills']
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]
bcrypt_context = CryptContext(schemes = ['bcrypt'], deprecated='auto')

class SkillRequest(BaseModel):
    super_category: str = Field(min_length = 1, max_length=100)
    sub_category: str = Field(min_length = 1, max_length=100)

class UserSkillRequest(BaseModel):
    skill_sub_category: str = Field(min_length = 1, max_length = 100)
    is_learning: bool = Field()

@router.get('/by_id/{skill_id}', status_code = status.HTTP_200_OK)
async def get_skill_by_id(user: user_dependency, db: db_dependency, skill_id: int = Path(gt = 0)):
    if user is None:
        raise HTTPException(status_code=401, detail = "Authentication Failed")
    skills_result = (db.query(Skills).filter(skill_id == Skills.id).first())
    if skills_result is not None:
        return skills_result
    raise HTTPException(status_code = 404, detail = 'Skill not found')

'''Gets all skills a user has'''
@router.get('/skillsHas/{user_id}', status_code = status.HTTP_200_OK)
async def get_skills_user_has(request: Request, db: db_dependency, user_id: int = Path(gt = 0)):
    user = await get_current_user(request.cookies.get('access_token'))
    if user is None:
        raise HTTPException(status_code=401, detail = "Authentication Failed")
    user_skills_result = (db.query(UsersSkills).filter(and_(user_id == UsersSkills.user_id, UsersSkills.is_learning == False)).all())
    if user_skills_result is not None:
        return user_skills_result
    raise HTTPException(status_code = 404, detail = 'Skill not found')

'''Gets all skills a user is learning'''
@router.get('/skillsLearning/{user_id}', status_code = status.HTTP_200_OK)
async def get_skills_user_is_learning(request: Request, db: db_dependency, user_id: int = Path(gt = 0)):
    user = await get_current_user(request.cookies.get('access_token'))
    if user is None:
        raise HTTPException(status_code=401, detail = "Authentication Failed")
    user_skills_result = (db.query(UsersSkills).filter(and_(user_id == UsersSkills.user_id, UsersSkills.is_learning == True)).all())
    if user_skills_result is not None:
        return user_skills_result
    raise HTTPException(status_code = 404, detail = 'Skill not found')

'''Temp endpoint DELETE WHEN DONE'''
@router.post('/create_userskill', status_code = status.HTTP_201_CREATED)
async def create_userskill(user: user_dependency, db: db_dependency, userskill_request: UserSkillRequest):
    if user is None:
        raise HTTPException(status_code = 401, detail = "Authentication Failed")
    user_skill_model = UsersSkills(**userskill_request.model_dump(), user_id = user.get('id'))
    if user_skill_model is None:
        raise HTTPException(status_code = 404, detail = 'Skill not found')
    db.add(user_skill_model)
    db.commit()

'''deletes a userskill by its name'''
@router.delete('/skill/{skill_sub_category}', status_code = status.HTTP_204_NO_CONTENT)
async def delete_userskill_by_name(request: Request, db: db_dependency, skill_sub_category: str = Path()):
    user = await get_current_user(request.cookies.get('access_token'))
    if user is None:
        raise HTTPException(status_code = 401, detail = "Authentication Failed")
    user_skill_model = db.query(UsersSkills).filter(skill_sub_category == UsersSkills.skill_sub_category).first()
    if user_skill_model is None:
        raise HTTPException(status_code = 404, detail = "UserSkill not found")
    db.delete(user_skill_model)
    db.commit()