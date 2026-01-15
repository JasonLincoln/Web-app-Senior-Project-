from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from starlette import status
from database import SessionLocal
from models import Ratings
from routers.auth import get_current_user
from pydantic import BaseModel, Field

'''Defines the router for the ratings functions'''
router = APIRouter(
    prefix = "/ratings",
    tags = ["ratings"]
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

'''The model for giving another user a rating'''
class RatingRequest(BaseModel):
    feedback_text: str = Field(min_length=1, max_length=1000)
    feedback_rating: int = Field(gt=0)
    recipient_username: str = Field(min_length=1)

'''Gets all ratings for a user'''
@router.get('/{recipient_username}', status_code = status.HTTP_200_OK)
async def get_ratings(request: Request, db: db_dependency, recipient_username: str):
    user = await get_current_user(request.cookies.get('access_token'))
    if user is None:
        raise HTTPException(status_code=401, detail="Authentication Failed")
    ratings_result = (db.query(Ratings).filter(recipient_username == Ratings.recipient_username).all())
    if ratings_result is not None:
        return ratings_result
    raise HTTPException(status_code=404, detail="Ratings not found")

'''creates a new rating between two users'''
@router.post('/create_rating', status_code = status.HTTP_201_CREATED)
async def create_rating(request: Request, db: db_dependency, rating_request: RatingRequest):
    user = await get_current_user(request.cookies.get('access_token'))
    if user is None:
        raise HTTPException(status_code = 401, detail = "Authentication Failed")
    rating_model = Ratings(**rating_request.model_dump(), sender_username = user.get('username'))
    if rating_request.recipient_username == user.get('username'):
        raise HTTPException(status_code = 406, detail = 'Cannot send a message to oneself')
    if rating_model is None:
        raise HTTPException(status_code = 404, detail = 'Message not found')
    db.add(rating_model)
    db.commit()
