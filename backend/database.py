from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import NullPool, StaticPool
from config import settings
from models import Base

# Configurar engine según el tipo de base de datos
if settings.DATABASE_URL.startswith("sqlite"):
    # SQLite para desarrollo local
    engine = create_engine(
        settings.DATABASE_URL,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool
    )
else:
    # PostgreSQL para producción
    engine = create_engine(
        settings.DATABASE_URL,
        poolclass=NullPool,
        connect_args={"connect_timeout": 10}
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def create_tables():
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()