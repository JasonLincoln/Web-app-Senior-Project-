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
from models import Users, UsersSkills, Skills, Sessions, Ratings
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

class RatingRequest(BaseModel):
    feedback_text: str = Field(min_length = 1, max_length = 100)
    feedback_rating: int = Field(gt = 0)

'''Gets all ratings for a user'''
@router.get('/ratings', status_code = status.HTTP_200_OK)
async def get_ratings(user: user_dependency, db: db_dependency, user_id: int):
    if user is None:
        raise HTTPException(status_code=401, detail="Authentication Failed")
    ratings_result = (db.query(Ratings).filter(user_id == Ratings.recipient_username).all())
    if ratings_result is not None:
        return ratings_result
    raise HTTPException(status_code=404, detail="Ratings not found")