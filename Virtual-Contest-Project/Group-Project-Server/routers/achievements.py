from typing import Annotated
from fastapi import APIRouter, Depends
from passlib.context import CryptContext
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from database import SessionLocal
from routers.auth import get_current_user

router = APIRouter(
    prefix = "/skills",
    tags = ['skills']
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

class AchievementRequest(BaseModel):
    name: str = Field(min_length = 1, max_length = 100)
    description: str = Field(min_length = 1, max_length = 100)
    img_url: str = Field(min_length = 1, max_length = 100)