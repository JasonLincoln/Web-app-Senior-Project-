from datetime import datetime
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, Path
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

'''gets an audit by it's id'''
@router.get('/by_audit_id/{audit_id}', status_code = status.HTTP_200_OK)
async def get_audit_by_id(db: db_dependency, audit_id: int = Path(gt = 0)):
    audit_result = (db.query(Audits).filter(audit_id == Audits.id).first())
    if audit_result is not None:
        return audit_result
    raise HTTPException(status_code = 404, detail = 'Audit not found')

@router.post('/create_audit', status_code = status.HTTP_201_CREATED)
async def create_audit(audit_request: AuditsRequest, db: db_dependency):
    audit_model = Audits(**audit_request.model_dump())
    if audit_model is None:
        raise HTTPException(status_code = 404, detail = 'Audit not found')
    db.add(audit_model)
    db.commit()