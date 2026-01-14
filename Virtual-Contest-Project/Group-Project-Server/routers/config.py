from pydantic_settings import BaseSettings

# Settings for environment variables
class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str

settings = Settings()

