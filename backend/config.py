from pathlib import Path
import os
from dotenv import load_dotenv

# Cargar .env automáticamente desde la raíz del backend
env_path = Path(__file__).parent / ".env"
if env_path.exists():
    load_dotenv(dotenv_path=env_path)

class Settings:
    def __init__(self):
        # Google
        self.GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
        self.GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")

        # JWT
        self.SECRET_KEY = os.getenv("SECRET_KEY", "change-me")
        self.ACCESS_TOKEN_EXPIRE_SECONDS = int(os.getenv("ACCESS_TOKEN_EXPIRE_SECONDS", "3600"))

        # Postgres components (from your .env)
        self.DATABASE_HOST = os.getenv("DATABASE_HOST")
        self.DATABASE_PORT = os.getenv("DATABASE_PORT")
        self.DATABASE_USER = os.getenv("DATABASE_USER")
        self.DATABASE_PASSWORD = os.getenv("DATABASE_PASSWORD")
        self.DATABASE_NAME = os.getenv("DATABASE_NAME")
        self.DATABASE_URL = os.getenv("DATABASE_URL")  # optional full url

    def __repr__(self):
        return f"<Settings db={self.DATABASE_HOST}:{self.DATABASE_PORT}/{self.DATABASE_NAME} google_client={self.GOOGLE_CLIENT_ID}>"

# Singleton para importación: from config import settings
settings = Settings()