from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, Path, Request
from passlib.context import CryptContext
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from starlette import status
from database import SessionLocal
from models import Messages
from routers.auth import get_current_user
from sqlalchemy import and_, or_

'''Defines the router for the messages functions'''
router = APIRouter(
    prefix = "/messages",
    tags = ['messages']
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

'''The request model for creating a message'''
class MessagesRequest(BaseModel):
    recipient_username: str = Field(min_length = 1, max_length = 100)
    text: str = Field(min_length = 1, max_length = 1000)

'''gets all messages a user has to or from another user'''
@router.get("/{other_user_username}", status_code = status.HTTP_200_OK)
async def get_all_messages_with_user(request: Request, db: db_dependency, other_user_username: str = Path(min_length = 1)):
    user = await get_current_user(request.cookies.get('access_token'))
    if user is None:
        raise HTTPException(status_code = 401, detail = "Authentication Failed")
    messages_result = (db.query(Messages)
                       .filter(or_(and_(other_user_username == Messages.recipient_username, Messages.sender_username == user.get('username'))
                                   ,other_user_username == Messages.sender_username, Messages.recipient_username == user.get('username')))
                       .all())
    if messages_result is not None:
        return messages_result
    raise HTTPException(status_code = 404, detail = "Username not found")

'''creates a new message between two users'''
@router.post('/create_message', status_code = status.HTTP_201_CREATED)
async def create_message(request: Request, db: db_dependency, message_request: MessagesRequest):
    user = await get_current_user(request.cookies.get('access_token'))
    if user is None:
        raise HTTPException(status_code = 401, detail = "Authentication Failed")
    message_model = Messages(**message_request.model_dump(), sender_username = user.get('username'))
    if message_request.recipient_username == user.get('username'):
        raise HTTPException(status_code = 406, detail = 'Cannot send a message to oneself')
    if message_model is None:
        raise HTTPException(status_code = 404, detail = 'Message not found')
    db.add(message_model)
    db.commit()

'''creates a message for newly registered users'''
@router.post('/automated_message', status_code = status.HTTP_201_CREATED)
async def automated_message(db: db_dependency, message_request: MessagesRequest):
    message_model = Messages(**message_request.model_dump(), sender_username = "DaeTheMyth78")
    if message_model is None:
        raise HTTPException(status_code = 404, detail = 'Message not found')
    db.add(message_model)
    db.commit()