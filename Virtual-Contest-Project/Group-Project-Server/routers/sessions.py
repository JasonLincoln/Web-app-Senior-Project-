from datetime import datetime
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, Request, Path
from pydantic import BaseModel, Field
from sqlalchemy import and_, or_
from sqlalchemy.orm import Session
from starlette import status
from database import SessionLocal
from models import Sessions
from routers.auth import get_current_user

'''Defines the router for the session functions'''
router = APIRouter(
    prefix = "/sessions",
    tags = ['sessions']
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

'''The model for creating a session'''
class SessionsRequest(BaseModel):
    session_date: datetime = Field()
    recipient_username: str = Field(min_length=1, max_length=100)
    accepted: bool = Field(default = False)

'''Gets all session a user has accepted'''
@router.get('/accepted/{username}', status_code = status.HTTP_200_OK)
async def get_accepted_sessions(request: Request, db: db_dependency, username: str):
    user = await get_current_user(request.cookies.get('access_token'))
    if user is None:
        raise HTTPException(status_code=401, detail="Authentication Failed")
    sessions_result = (db.query(Sessions).filter(and_(or_(username == Sessions.sender_username, username == Sessions.recipient_username)), Sessions.accepted == True).all())
    if sessions_result is not None:
        return sessions_result
    raise HTTPException(status_code=404, detail="Sessions not found")

'''Gets all session a user has requested'''
@router.get('/requested/{username}', status_code = status.HTTP_200_OK)
async def get_requested_sessions(request: Request, db: db_dependency, username: str):
    user = await get_current_user(request.cookies.get('access_token'))
    if user is None:
        raise HTTPException(status_code=401, detail="Authentication Failed")
    sessions_result = (db.query(Sessions).filter(and_(username == Sessions.recipient_username, Sessions.accepted == False)).all())
    if sessions_result is not None:
        return sessions_result
    raise HTTPException(status_code=404, detail="Sessions not found")

'''Updates a session based on its id'''
@router.put('/update_session/{session_id}', status_code = status.HTTP_204_NO_CONTENT)
async def update_session(db: db_dependency, session_request: SessionsRequest, session_id: int = Path(gt = 0)):
    session_model = (db.query(Sessions)
                   .filter(session_id == Sessions.id)
                   .first())
    if session_model is None:
        raise HTTPException(status_code = 404, detail = 'Session not found')

    session_model.accepted = session_request.accepted

    db.add(session_model)
    db.commit()

'''Gets all session a user has accepted'''
@router.get('/sessions/accepted', status_code = status.HTTP_200_OK)
async def get_sessions(user: user_dependency, db: db_dependency, username: str):
    if user is None:
        raise HTTPException(status_code=401, detail="Authentication Failed")
    sessions_result = (db.query(Sessions).filter(and_(or_(username == Sessions.sender_username, username == Sessions.recipient_username)), Sessions.accepted == True).all())
    if sessions_result is not None:
        return sessions_result
    raise HTTPException(status_code=404, detail="Sessions not found")

'''Gets all session a user has requested'''
@router.get('/sessions/requested', status_code = status.HTTP_200_OK)
async def get_sessions(user: user_dependency, db: db_dependency, username: str):
    if user is None:
        raise HTTPException(status_code=401, detail="Authentication Failed")
    sessions_result = (db.query(Sessions).filter(and_(username == Sessions.recipient_username, Sessions.accepted == False)).all())
    if sessions_result is not None:
        return sessions_result
    raise HTTPException(status_code=404, detail="Sessions not found")













'''creates a new session between two or more users'''
@router.post('/create_session', status_code = status.HTTP_201_CREATED)
async def create_session(request: Request, db: db_dependency, session_request: SessionsRequest):
    user = await get_current_user(request.cookies.get('access_token'))
    if user is None:
        raise HTTPException(status_code=401, detail="Authentication Failed")
    session_model = Sessions(**session_request.model_dump(), sender_username = user.get('username'))
    if session_model is None:
        raise HTTPException(status_code = 404, detail = 'Message not found')
    db.add(session_model)
    db.commit()

'''deletes a session by it's id'''
@router.delete('/delete_session/{session_id}', status_code = status.HTTP_204_NO_CONTENT)
async def delete_session_by_id(request: Request, db: db_dependency, session_id: int = Path(gt = 0)):
    user = await get_current_user(request.cookies.get('access_token'))
    if user is None:
        raise HTTPException(status_code=401, detail="Authentication Failed")
    session_model = db.query(Sessions).filter(session_id == Sessions.id).first()
    if session_model is None:
        raise HTTPException(status_code = 404, detail = "Session not found")
    db.query(Sessions).filter(session_id == Sessions.id).delete()
    db.commit()