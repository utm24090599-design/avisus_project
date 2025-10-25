import os

class Settings:
    # Database
    DATABASE_URL = os.getenv("DATABASE_URL")
    
    # Validar que DATABASE_URL exista
    if not DATABASE_URL:
        raise ValueError("❌ DATABASE_URL no está configurada. Por favor configúrala en las variables de entorno de Vercel.")
    
    # Convertir postgres:// a postgresql://
    if DATABASE_URL.startswith("postgres://"):
        DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)
    
    # Google OAuth
    GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
    GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
    
    if not GOOGLE_CLIENT_ID or not GOOGLE_CLIENT_SECRET:
        raise ValueError("❌ Credenciales de Google no configuradas")
    
    # JWT
    SECRET_KEY = os.getenv("SECRET_KEY")
    if not SECRET_KEY:
        raise ValueError("❌ SECRET_KEY no está configurada")
    
    ALGORITHM = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24
    
    # CORS
    ALLOWED_ORIGINS = ["*"]