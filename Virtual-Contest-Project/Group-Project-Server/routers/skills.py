from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, Path
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from starlette import status
from database import SessionLocal
from models import Skills
from routers.auth import get_current_user

'''Defines the router for the skill functions'''
router = APIRouter(
    prefix="/skills",
    tags=['skills']
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

'''The model for creating a skill'''
class SkillRequest(BaseModel):
    super_category: str = Field(min_length = 1, max_length=100)
    sub_category: str = Field(min_length = 1, max_length=100)

'''The model for creating a user_skill'''
class UserSkillRequest(BaseModel):
    user_id: int = Field(gt = 0)
    skill_id: int = Field(gt = 0)

'''Gets a skill by its id'''
@router.get('/by_id/{skill_id}', status_code = status.HTTP_200_OK)
async def get_skill_by_id(user: user_dependency, db: db_dependency, skill_id: int = Path(gt = 0)):
    if user is None:
        raise HTTPException(status_code=401, detail = "Authentication Failed")
    skills_result = (db.query(Skills).filter(skill_id == Skills.id).first())
    if skills_result is not None:
        return skills_result
    raise HTTPException(status_code = 404, detail = 'Skill not found')

