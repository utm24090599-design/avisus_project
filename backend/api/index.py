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
from role_service import RoleService

# Crear tablas si no existen
try:
    Base.metadata.create_all(bind=engine)
except Exception as e:
    print(f"Error creando tablas: {e}")

app = FastAPI(title="UTMA Role System API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:4200",
        "http://127.0.0.1:4200",
        "http://localhost:3000",
        "*"  # Fallback
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
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
async def register_with_google(body: dict, db: Session = Depends(get_db)):
    """
    Registro con Google Sign-In:
     - Recibe token de Google
     - Determina automáticamente el rol basado en el correo
     - Crea o actualiza el usuario con su rol asignado
     - Genera y retorna el JWT token automáticamente
    """
    token = body.get("token")
    if not token:
        raise HTTPException(status_code=400, detail="token required")

    info = await AuthService.verify_google_token(token)
    email = info.get("email")
    if not email:
        raise HTTPException(status_code=400, detail="Email not present")

    # Determinar rol automáticamente basado en el correo
    try:
        role, role_color, role_badge = RoleService.determine_role(email)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    # check or create user
    user = db.query(User).filter(User.email == email).first()
    if not user:
        user = User(
            email=email, 
            name=info.get("name") or "", 
            google_id=info.get("google_id"),
            picture=info.get("picture"), 
            role=role,
            role_color=role_color,
            role_badge=role_badge
        )
        db.add(user)
    else:
        # update role, color, badge and update picture/name
        user.role = role
        user.role_color = role_color
        user.role_badge = role_badge
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

    # Generar JWT token automáticamente
    access_token = AuthService.create_access_token(subject=user.email)
    return {"access_token": access_token, "token_type": "bearer", "user": user}

@app.post("/auth/register-traditional", response_model=TokenResponse)
async def register_traditional(body: dict, db: Session = Depends(get_db)):
    """
    Registro tradicional con email y password:
     - Recibe email, name y password
     - Verifica que el correo sea institucional
     - Determina automáticamente el rol basado en el correo
     - Crea el usuario con su rol asignado
     - Genera y retorna el JWT token automáticamente
    """
    try:
        email = body.get("email")
        name = body.get("name")
        password = body.get("password")
        
        if not email or not name or not password:
            raise HTTPException(status_code=400, detail="email, name and password are required")

        print(f"🔍 Registrando usuario: {email}")

        # Verificar que el correo sea institucional
        if not RoleService.is_institutional_email(email):
            raise HTTPException(status_code=400, detail="Solo se permiten correos institucionales (.edu)")

        # Verificar si el usuario ya existe
        existing_user = db.query(User).filter(User.email == email).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="El correo ya está registrado")
        
        # Determinar rol automáticamente basado en el correo
        try:
            role, role_color, role_badge = RoleService.try_determine_role_from_email(email)
            print(f"✅ Rol determinado: {role}")
        except ValueError as e:
            print(f"❌ Error determinando rol: {e}")
            raise HTTPException(status_code=400, detail=str(e))

        # Hashear contraseña
        password_hash = AuthService.hash_password(password)
        print(f"✅ Contraseña hasheada")

        # Crear usuario
        from datetime import datetime
        user = User(
            email=email,
            name=name,
            password_hash=password_hash,
            role=role,
            role_color=role_color,
            role_badge=role_badge,
            created_at=datetime.utcnow(),
            last_login=datetime.utcnow()
        )
        db.add(user)
        
        try:
            db.commit()
            print(f"✅ Usuario creado en BD")
            db.refresh(user)
        except Exception as e:
            db.rollback()
            print(f"❌ Error creando usuario en BD: {e}")
            import traceback
            traceback.print_exc()
            raise HTTPException(status_code=500, detail=f"Error creating user: {str(e)}")

        # Generar JWT token automáticamente
        access_token = AuthService.create_access_token(subject=user.email)
        print(f"✅ Token generado")
        return {"access_token": access_token, "token_type": "bearer", "user": user}
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error inesperado en register-traditional: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.post("/auth/login", response_model=TokenResponse)
async def login(body: dict, db: Session = Depends(get_db)):
    """
    Login con email y password:
     - Recibe email y password
     - Verifica las credenciales
     - Actualiza last_login
     - Genera y retorna el JWT token
    """
    try:
        email = body.get("email")
        password = body.get("password")
        
        if not email or not password:
            raise HTTPException(status_code=400, detail="email and password are required")

        # Buscar usuario por email
        user = db.query(User).filter(User.email == email).first()
        
        # Verificar usuario y contraseña
        if not user or not user.password_hash:
            raise HTTPException(status_code=401, detail="Credenciales inválidas")
        
        if not AuthService.verify_password(password, user.password_hash):
            raise HTTPException(status_code=401, detail="Credenciales inválidas")
        
        # Actualizar last_login
        from datetime import datetime
        user.last_login = datetime.utcnow()
        
        try:
            db.commit()
            db.refresh(user)
        except Exception as e:
            db.rollback()
            print(f"Error updating last login: {e}")
            raise HTTPException(status_code=500, detail=f"Error updating last login: {str(e)}")

        # Generar JWT token automáticamente
        access_token = AuthService.create_access_token(subject=user.email)
        return {"access_token": access_token, "token_type": "bearer", "user": user}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in login endpoint: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

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

# Handler para Vercel (serverless)
def handler(request, response):
    """Handler para Vercel serverless functions"""
    from mangum import Mangum
    mangum_handler = Mangum(app)
    return mangum_handler(request, response)
    
from mangum import Mangum

# Crear handler para Vercel
handler = Mangum(app, lifespan="off")
