# schemas.py
from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

class UserBase(BaseModel):
    email: str
    name: str

class UserCreate(UserBase):
    google_id: str
    picture: Optional[str] = None

class UserResponse(BaseModel):
    id: int
    email: str
    name: str
    picture: Optional[str]
    role: str
    role_color: str
    role_badge: str
    created_at: datetime
    last_login: Optional[datetime]
    
    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class GoogleAuthRequest(BaseModel):
    token: str

class GoogleVerifyResponse(BaseModel):
    """Respuesta de verificación de Google OAuth"""
    email: str
    name: Optional[str] = None
    picture: Optional[str] = None
    allowed_roles: List[str] = []  # ← ESTO FALTABA
