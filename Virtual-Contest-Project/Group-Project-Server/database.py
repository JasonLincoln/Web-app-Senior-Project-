from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

'''Uses the database url to make a connection between the API and the database'''
SQLALCHEMY_DATABASE_URL = "postgresql://postgres:lab123@localhost/SkillSwapDatabase"
# SQLALCHEMY_DATABASE_URL = "postgresql://postgres:2048@localhost/SkillSwapDatabase"

engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit = False, autoflush = False, bind = engine)
Base = declarative_base()