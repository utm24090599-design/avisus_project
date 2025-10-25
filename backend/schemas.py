from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class UserBase(BaseModel):
    email: EmailStr
    name: str

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
        orm_mode = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class GoogleAuthRequest(BaseModel):
    token: str

# Response from /auth/google before registration
class GoogleVerifyResponse(BaseModel):
    email: EmailStr
    name: str
    picture: Optional[str]
    allowed_roles: list[str]