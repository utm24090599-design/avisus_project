from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import sys
from pathlib import Path

# Agregar el directorio raíz al path
root = Path(__file__).parent.parent
sys.path.append(str(root))

from config import settings
from database import create_tables, get_db
from schemas import GoogleAuthRequest, TokenResponse, UserResponse
from auth_service import AuthService
from dependencies import get_current_user
from models import User

# Crear tablas (solo se ejecuta una vez)
try:
    create_tables()
except:
    pass

# Inicializar FastAPI
app = FastAPI(
    title="UTMA Role System API",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# AUTH ENDPOINTS
@app.post("/auth/google", response_model=TokenResponse)
async def google_auth(
    auth_request: GoogleAuthRequest,
    db: Session = Depends(get_db)
):
    """Autenticación con Google OAuth"""
    google_info = await AuthService.verify_google_token(auth_request.token)
    user = AuthService.get_or_create_user(db, google_info)
    access_token = AuthService.create_access_token(
        data={"user_id": user.id, "email": user.email}
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

@app.get("/auth/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    """Obtiene la información del usuario autenticado"""
    return current_user

# USER ENDPOINTS
@app.get("/api/users", response_model=List[UserResponse])
async def get_all_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Obtiene todos los usuarios"""
    users = db.query(User).all()
    return users

@app.get("/api/users/role/{role}", response_model=List[UserResponse])
async def get_users_by_role(
    role: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Obtiene usuarios por rol"""
    users = db.query(User).filter(User.role == role).all()
    return users

@app.get("/api/user/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Obtiene un usuario por ID"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return user

@app.get("/")
async def root():
    return {
        "message": "UTMA Role System API",
        "status": "running",
        "version": "1.0.0"
    }

# Este handler es necesario para Vercel
handler = app