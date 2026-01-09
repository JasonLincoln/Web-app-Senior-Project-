from datetime import datetime
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from passlib.context import CryptContext
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from starlette import status
from database import SessionLocal
from models import Sessions, UsersSession
from routers.auth import get_current_user

router = APIRouter(
    prefix = "/sessions",
    tags = ['sessions']
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]
bcrypt_context = CryptContext(schemes = ['bcrypt'], deprecated = 'auto')

class SessionsRequest(BaseModel):
    session_date: datetime = Field()

class UserSessionRequest(BaseModel):
    user_id: int = Field(gt=0)
    session_id: int = Field(gt=0)

'''creates a new session between two or more users'''
@router.post('/create_session', status_code = status.HTTP_201_CREATED)
async def create_session(db: db_dependency, session_request: SessionsRequest):
    # if user is None:
    #     raise HTTPException(status_code = 401, detail = "Authentication Failed")
    session_model = Sessions(**session_request.model_dump())
    if session_model is None:
        raise HTTPException(status_code = 404, detail = 'Message not found')
    db.add(session_model)
    db.commit()

@router.post('/create_usersession', status_code = status.HTTP_201_CREATED)
async def create_skill(user: user_dependency, db: db_dependency, usersession_request: UserSessionRequest):
    user_skill_model = UsersSession(**usersession_request.model_dump(), sender_id = user.get('id'))
    if user_skill_model is None:
        raise HTTPException(status_code = 404, detail = 'Skill not found')
    db.add(user_skill_model)
    db.commit()