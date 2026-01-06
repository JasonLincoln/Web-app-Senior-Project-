from datetime import datetime
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from starlette import status

from database import SessionLocal
from models import Audits
from routers.auth import get_current_user

'''Connects the endpoints to FastAPI under the Users category'''
router = APIRouter(
    prefix = "/audits",
    tags = ['audits']
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

class AuditsRequest(BaseModel):
    user_id: int = Field(gt=0)
    entity_id: int = Field(gt=0)
    entity_affected: str = Field(min_length=1, max_length=100)
    timestamp: datetime = Field()
    details: str = Field(min_length=1, max_length=200)
    successful_event: bool = Field()
    error_details: str = Field(min_length=1, max_length=200)

@router.post('/create_audit', status_code = status.HTTP_201_CREATED)
async def create_audit(audit_request: AuditsRequest, db: db_dependency):
    audit_model = Audits(**audit_request.model_dump())
    if audit_model is None:
        raise HTTPException(status_code = 404, detail = 'Audit not found')
    db.add(audit_model)
    db.commit()