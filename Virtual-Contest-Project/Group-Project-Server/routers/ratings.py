from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from starlette import status
from database import SessionLocal
from models import Messages
from routers.auth import get_current_user
from pydantic import BaseModel, Field

router = APIRouter(
    prefix = "/messages",
    tags = ['messages']
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]

class RatingRequest(BaseModel):
    feedback_text: str = Field(min_length=1, max_length=1000)
    feedback_rating: int = Field(gt=0)
    recipient_username: str = Field(min_length=1)

'''creates a new rating between two users'''
@router.post('/create_rating', status_code = status.HTTP_201_CREATED)
async def create_rating(request: Request, db: db_dependency, rating_request: RatingRequest):
    user = await get_current_user(request.cookies.get('access_token'))
    if user is None:
        raise HTTPException(status_code = 401, detail = "Authentication Failed")
    rating_model = Messages(**rating_request.model_dump(), sender_username = user.get('username'))
    if rating_request.recipient_username == user.get('username'):
        raise HTTPException(status_code = 406, detail = 'Cannot send a message to oneself')
    if rating_model is None:
        raise HTTPException(status_code = 404, detail = 'Message not found')
    db.add(rating_model)
    db.commit()