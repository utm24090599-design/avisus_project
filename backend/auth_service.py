# auth_service.py
from google.oauth2 import id_token
from google.auth.transport import requests
import jwt  # Cambiado de jose
from datetime import datetime, timedelta
from fastapi import HTTPException, status
from config import settings
from models import User
from sqlalchemy.orm import Session
from role_service import RoleService

class AuthService:
    @staticmethod
    async def verify_google_token(token: str) -> dict:
        """Verifica el token de Google y retorna la información del usuario"""
        try:
            idinfo = id_token.verify_oauth2_token(
                token, 
                requests.Request(), 
                settings.GOOGLE_CLIENT_ID
            )
            
            if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
                raise ValueError('Wrong issuer.')
            
            return idinfo
        except ValueError as e:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Token inválido: {str(e)}"
            )
    
    @staticmethod
    def create_access_token(data: dict) -> str:
        """Crea un JWT token"""
        to_encode = data.copy()
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        to_encode.update({"exp": expire})
        # Cambiado: usa jwt.encode en lugar de jose.jwt.encode
        encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
        return encoded_jwt
    
    @staticmethod
    def decode_token(token: str) -> dict:
        """Decodifica y valida un JWT token"""
        try:
            # Cambiado: usa jwt.decode en lugar de jose.jwt.decode
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
            return payload
        except jwt.PyJWTError:  # Cambiado de JWTError
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token inválido o expirado"
            )
    
    @staticmethod
    def get_or_create_user(db: Session, google_info: dict) -> User:
        """Obtiene o crea un usuario basado en la información de Google"""
        email = google_info.get('email')
        google_id = google_info.get('sub')
        name = google_info.get('name')
        picture = google_info.get('picture')
        
        # Buscar usuario existente
        user = db.query(User).filter(User.email == email).first()
        
        if user:
            user.last_login = datetime.utcnow()
            if picture:
                user.picture = picture
            db.commit()
            db.refresh(user)
            return user
        
        # Crear nuevo usuario
        try:
            role, color, badge = RoleService.determine_role(email)
        except ValueError as e:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=str(e)
            )
        
        new_user = User(
            email=email,
            name=name,
            google_id=google_id,
            picture=picture,
            role=role,
            role_color=color,
            role_badge=badge
        )
        
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        return new_user