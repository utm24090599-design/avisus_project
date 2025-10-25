# auth_service.py
from google.oauth2 import id_token
from google.auth.transport import requests as grequests
from datetime import datetime, timedelta
from fastapi import HTTPException, status
from config import settings
from models import User
from sqlalchemy.orm import Session
from role_service import RoleService
import jwt

class AuthService:
    @staticmethod
    async def verify_google_token(token: str) -> dict:
        """
        Verifica id_token de Google y retorna payload con email, name, picture, sub (google_id).
        Lanza HTTPException en caso de error.
        """
        try:
            request = grequests.Request()
            payload = id_token.verify_oauth2_token(token, request, settings.GOOGLE_CLIENT_ID)
            # payload contains: email, email_verified, name, picture, sub
            return {
                "email": payload.get("email"),
                "name": payload.get("name"),
                "picture": payload.get("picture"),
                "google_id": payload.get("sub")
            }
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Invalid Google token: {e}")

    @staticmethod
    def allowed_roles_for_email(email: str):
        return RoleService.get_allowed_roles(email)

    @staticmethod
    def create_access_token(subject: str, expires_delta: int = None) -> str:
        expire = datetime.utcnow() + timedelta(seconds=(expires_delta or settings.ACCESS_TOKEN_EXPIRE_SECONDS))
        to_encode = {"sub": subject, "exp": expire}
        token = jwt.encode(to_encode, settings.SECRET_KEY, algorithm="HS256")
        # jwt.encode returns str in PyJWT>=2
        return token

    @staticmethod
    def decode_access_token(token: str) -> dict:
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            return payload
        except jwt.ExpiredSignatureError:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expired")
        except Exception:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")