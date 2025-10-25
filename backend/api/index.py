from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from pathlib import Path
import sys

# Agregar el directorio raíz al path (moved before other imports)
root = Path(__file__).parent.parent
sys.path.append(str(root))

from config import settings
from database import get_db, engine
from schemas import GoogleAuthRequest, TokenResponse, UserResponse, GoogleVerifyResponse, UserBase
from auth_service import AuthService
from dependencies import get_current_user
from models import Base, User

# Crear tablas si no existen
try:
    Base.metadata.create_all(bind=engine)
except Exception as e:
    print(f"Error creando tablas: {e}")

app = FastAPI(title="UTMA Role System API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/auth/google", response_model=GoogleVerifyResponse)
async def google_auth_verify(auth_request: GoogleAuthRequest):
    """
    Verifica el id_token con Google y devuelve info básica + allowed_roles.
    No crea usuario ni emite JWT aquí.
    """
    info = await AuthService.verify_google_token(auth_request.token)
    if not info.get("email"):
        raise HTTPException(status_code=400, detail="Email not found in token")
    allowed = AuthService.allowed_roles_for_email(info["email"])
    return {
        "email": info["email"],
        "name": info.get("name"),
        "picture": info.get("picture"),
        "allowed_roles": allowed
    }

@app.post("/auth/register", response_model=TokenResponse)
async def register_with_role(body: dict, db: Session = Depends(get_db)):
    """
    Recibe { token, role }:
     - verifica token Google
     - valida role permitido
     - crea usuario si no existe
     - actualiza last_login y devuelve access_token + user
    """
    token = body.get("token")
    role = body.get("role")
    if not token or not role:
        raise HTTPException(status_code=400, detail="token and role required")

    info = await AuthService.verify_google_token(token)
    email = info.get("email")
    if not email:
        raise HTTPException(status_code=400, detail="Email not present")

    allowed = AuthService.allowed_roles_for_email(email)
    if role not in allowed:
        raise HTTPException(status_code=403, detail="Role not allowed for this email")

    # check or create user
    user = db.query(User).filter(User.email == email).first()
    if not user:
        user = User(email=email, name=info.get("name") or "", google_id=info.get("google_id"),
                    picture=info.get("picture"), role=role)
        db.add(user)
    else:
        # update role if different and update picture/name
        user.role = role
        user.name = info.get("name") or user.name
        user.picture = info.get("picture") or user.picture

    from datetime import datetime
    user.last_login = datetime.utcnow()
    try:
        db.commit()
        db.refresh(user)
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Error creating/updating user")

    access_token = AuthService.create_access_token(subject=user.email)
    return {"access_token": access_token, "token_type": "bearer", "user": user}

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

@app.get("/health")
async def health():
    return {"status": "healthy"}
