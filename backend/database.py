from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from config import settings
from models import Base
import logging
import urllib.parse

def build_database_url(s):
    # use explicit DATABASE_URL if present and valid
    if getattr(s, "DATABASE_URL", None):
        return s.DATABASE_URL

    user = s.DATABASE_USER or ""
    password = s.DATABASE_PASSWORD or ""
    host = s.DATABASE_HOST or "localhost"
    port = s.DATABASE_PORT or "5432"
    name = s.DATABASE_NAME or ""

    if not name:
        raise RuntimeError("DB name not configured")

    # quote password
    password_quoted = urllib.parse.quote_plus(password) if password else ""
    auth = f"{user}:{password_quoted}@" if user or password else ""
    return f"postgresql://{auth}{host}:{port}/{name}"

DATABASE_URL = build_database_url(settings)

try:
    engine = create_engine(DATABASE_URL)
except Exception as e:
    logging.error("Failed creating engine with DATABASE_URL=%s: %s", DATABASE_URL, e)
    raise

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def create_tables():
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()