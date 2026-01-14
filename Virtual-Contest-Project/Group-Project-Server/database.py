from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from routers.config import settings

'''Uses the database url to make a connection between the API and the database'''
SQLALCHEMY_DATABASE_URL = settings.DATABASE_URL

engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit = False, autoflush = False, bind = engine)
Base = declarative_base()