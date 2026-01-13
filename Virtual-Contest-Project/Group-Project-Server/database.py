from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from pydantic_settings import BaseSettings

# Settings for environment variables
class Settings(BaseSettings):
    DATABASE_URL: str

settings = Settings()
app  = FastAPI()

@app.get("/info")
async def info():
    return {
        "database_url": settings.database_url
    }

'''Uses the database url to make a connection between the API and the database'''
SQLALCHEMY_DATABASE_URL = "postgresql://skillswapdatabase_3ppr_user:4oW0Y3xsz2517yNxlRPXzX6f5RjyK872@dpg-d5j8j1vgi27c73epoo10-a/skillswapdatabase_3ppr"

engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit = False, autoflush = False, bind = engine)
Base = declarative_base()