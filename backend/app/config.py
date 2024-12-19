# config.py
from dotenv import load_dotenv
import os

load_dotenv()


class Settings:
    DATABASE_URL: str = "sqlite:///./users.db"  # Local SQLite DB file
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30


settings = Settings()