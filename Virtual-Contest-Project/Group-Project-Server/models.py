from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime
from database import Base

'''Database table models converted to Python'''
class Users(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key = True, index = True)
    email = Column(String, unique = True)
    username = Column(String, unique = True)
    display_name = Column(String)
    hashed_password = Column(String)
    rating = Column(Integer)
    pronouns = Column(String)
    biography = Column(String)
    profile_url = Column(String)
    role = Column(String)
    is_active = Column(Boolean)

class UsersSkills(Base):
    __tablename__ = 'users_skills'
    user_id = Column(Integer, ForeignKey('users.id'), primary_key = True)
    skill_sub_category = Column(String, ForeignKey('skills.sub_category'), primary_key = True)
    is_learning = Column(Boolean)

class Skills(Base):
    __tablename__ = 'skills'
    id = Column(Integer, primary_key = True, index = True)
    super_category = Column(String)
    sub_category = Column(String , unique = True)

class Messages(Base):
    __tablename__ = 'messages'
    id = Column(Integer, primary_key = True, index = True)
    recipient_username = Column(String, ForeignKey('users.username'))
    sender_username = Column(String, ForeignKey('users.username'))
    text = Column(String)
    time_sent = Column(DateTime, default = datetime.now)
    was_read = Column(Boolean, default = False)

class Sessions(Base):
    __tablename__ = 'sessions'
    id = Column(Integer, primary_key = True, index = True)
    session_date = Column(DateTime)
    accepted = Column(Boolean, default = False)
    recipient_username = Column(String, ForeignKey('users.username'))
    sender_username = Column(String, ForeignKey('users.username'))

class Ratings(Base):
    __tablename__ = 'ratings'
    id = Column(Integer, primary_key = True, index = True)
    feedback_text = Column(String)
    feedback_rating = Column(Integer)
    recipient_username = Column(String, ForeignKey('users.username'))
    sender_username = Column(String, ForeignKey('users.username'))

class Audits(Base):
    __tablename__ = 'audits'
    id = Column(Integer, primary_key = True, index = True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable = False)
    entity_id = Column(Integer, nullable=False)
    entity_affected = Column(String, nullable=False)
    timestamp = Column(DateTime, default = datetime.now)
    details = Column(String)
    successful_event = Column(Boolean)
    error_details = Column(String)
