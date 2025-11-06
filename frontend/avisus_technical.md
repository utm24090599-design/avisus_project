# 📘 MEMORIA TÉCNICA - PROYECTO AVISUS

**Versión:** 1.0.0  
**Fecha:** Noviembre 2025  

---

## 📑 ÍNDICE

1. [Resumen Ejecutivo](#1-resumen-ejecutivo)
2. [Introducción](#2-introducción)
3. [Análisis de Requerimientos](#3-análisis-de-requerimientos)
4. [Arquitectura del Sistema](#4-arquitectura-del-sistema)
5. [Tecnologías Seleccionadas](#5-tecnologías-seleccionadas)
6. [Diseño e Implementación Frontend](#6-diseño-e-implementación-frontend)
7. [Diseño e Implementación Backend](#7-diseño-e-implementación-backend)
8. [Seguridad](#8-seguridad)
9. [Sistema de Roles Automático](#9-sistema-de-roles-automático)
10. [Optimización y Rendimiento](#10-optimización-y-rendimiento)
11. [Pruebas y Validación](#11-pruebas-y-validación)
12. [Despliegue](#12-despliegue)
13. [Conclusiones y Trabajo Futuro](#13-conclusiones-y-trabajo-futuro)
14. [Referencias](#14-referencias)

---

## 1. RESUMEN EJECUTIVO

### 1.1 Objetivo del Proyecto

AVISUS es una plataforma web moderna diseñada para centralizar y facilitar la difusión de noticias, avisos y comunicados relevantes de la Universidad Tecnológica de la Mixteca Alta (UTMA). El sistema implementa autenticación robusta mediante OAuth 2.0 de Google y credenciales tradicionales, con un innovador sistema de asignación automática de roles basado en el formato del correo institucional.

### 1.2 Características Principales

- ✅ **Autenticación Multi-método**: Google OAuth 2.0 y registro tradicional
path
- ✅ **Asignación Automática de Roles**: Sistema inteligente basado en patrones de correo
- ✅ **Control de Acceso**: Permisos granulares por rol
- ✅ **Server-Side Rendering**: Angular 20 con SSR para mejor SEO
- ✅ **API RESTful**: FastAPI con documentación automática
- ✅ **Seguridad Robusta**: JWT, bcrypt, headers CSP, CORS configurado

### 1.3 Alcance

**Frontend:**
- Angular 20 con Zoneless Change Detection
- Signals para gestión de estado reactivo
- SSR con Express.js
- Guards e Interceptors

**Backend:**
- FastAPI (Python 3.10+)
- PostgreSQL/MySQL con SQLAlchemy ORM
- JWT Authentication
- Google OAuth 2.0 Integration
- Sistema de roles automático

---

## 2. INTRODUCCIÓN

### 2.1 Contexto

La Universidad Tecnológica de la Mixteca Alta necesita modernizar su sistema de comunicación interna, permitiendo:
- Publicar avisos institucionales de forma centralizada
- Gestionar usuarios con diferentes niveles de acceso
- Identificar automáticamente el tipo de usuario (estudiante, profesor, administrativo)
- Garantizar que solo usuarios institucionales accedan al sistema

### 2.2 Problemática Identificada

**Antes de AVISUS:**
- ❌ Información dispersa en múltiples canales (WhatsApp, email, físico)
- ❌ No hay registro de quién publica qué contenido
- ❌ Proceso manual para asignar roles a usuarios
- ❌ Falta de autenticación institucional verificada
- ❌ No hay control de versiones en avisos

**Después de AVISUS:**
- ✅ Plataforma única y centralizada
- ✅ Auditoría completa de publicaciones
- ✅ Roles asignados automáticamente según correo institucional
- ✅ Solo correos @utma.edu.mx pueden registrarse
- ✅ Historial completo de cambios

### 2.3 Innovación: Sistema de Roles Automático

Una de las características más innovadoras de AVISUS es su **sistema de asignación automática de roles** basado en patrones de correo electrónico institucional:

```
utm24090599@utma.edu.mx  → Estudiante 🎓
nombre.apellido@utma.edu.mx → Profesor/Administrativo 📚👔
```

Este sistema elimina la necesidad de aprobaciones manuales y garantiza que cada usuario tenga los permisos correctos desde el registro.

---

## 3. ANÁLISIS DE REQUERIMIENTOS

### 3.1 Requerimientos Funcionales

#### RF-01: Autenticación Dual
- **Prioridad**: Alta
- **Descripción**: Sistema que permita login con Google OAuth 2.0 Y registro tradicional con email/password
- **Criterios de aceptación**:
  - Usuario puede iniciar sesión con cuenta Google institucional
  - Usuario puede registrarse con email institucional y contraseña
  - Token JWT válido por 1 hora (configurable)
  - Validación de correo institucional (@utma.edu.mx o .edu)

#### RF-02: Asignación Automática de Roles
- **Prioridad**: Alta
- **Descripción**: El sistema debe determinar automáticamente el rol del usuario basándose en su correo
- **Criterios de aceptación**:
  - Correo con patrón `utm[números]@utma.edu.mx` → Estudiante
  - Correo con patrón `[nombre].[apellido]@utma.edu.mx` → Profesor/Administrativo
  - Asignación de color y badge distintivo por rol
  - Rechazo de correos no institucionales

#### RF-03: Gestión de Usuarios
- **Prioridad**: Media
- **Descripción**: CRUD completo de usuarios con control de acceso
- **Criterios de aceptación**:
  - Listar todos los usuarios (solo autenticados)
  - Filtrar por rol específico
  - Ver detalles de usuario individual
  - Seguimiento de última conexión

#### RF-04: Dashboard Principal
- **Prioridad**: Media
- **Descripción**: Panel con información personalizada según rol
- **Criterios de aceptación**:
  - Vista diferenciada por rol
  - Carga rápida < 2 segundos
  - Información del perfil del usuario

### 3.2 Requerimientos No Funcionales

#### RNF-01: Seguridad
- **Cifrado**: HTTPS obligatorio en producción
- **Passwords**: Hashing con bcrypt (costo 12)
- **Tokens**: JWT con expiración y validación
- **Headers**: CSP, HSTS, X-Frame-Options configurados
- **CORS**: Whitelist de orígenes permitidos

#### RNF-02: Rendimiento
- **Backend**: Respuesta API < 200ms
- **Frontend**: First Contentful Paint < 1.5s
- **Database**: Índices en email, google_id, role
- **SSR**: Pre-renderizado de rutas críticas

#### RNF-03: Escalabilidad
- **Arquitectura**: Separación frontend/backend
- **Database**: Connection pooling configurado
- **Horizontal**: Preparado para múltiples instancias
- **Cache**: Headers de cache para assets estáticos

#### RNF-04: Mantenibilidad
- **Código**: Type hints en Python, TypeScript estricto
- **Documentación**: FastAPI auto-documenta con OpenAPI
- **Logs**: Logging estructurado con niveles
- **Tests**: Cobertura objetivo > 70%

#### RNF-05: Usabilidad
- **Responsive**: Mobile-first design
- **Accesibilidad**: WCAG 2.1 nivel AA
- **Feedback**: Mensajes claros de error y éxito
- **Loading**: Indicadores visuales en operaciones asíncronas

---

## 4. ARQUITECTURA DEL SISTEMA

### 4.1 Arquitectura General (3 Capas)

```
┌────────────────────────────────────────────────────────────┐
│                    CAPA PRESENTACIÓN                       │
│                   (Angular 20 + SSR)                       │
├────────────────────────────────────────────────────────────┤
│  • Components (Smart & Presentational)                     │
│  • Services (AuthService, UserService)                     │
│  • Guards & Interceptors                                   │
│  • Signals para estado reactivo                            │
│  • Express.js server para SSR                              │
└────────────────────┬───────────────────────────────────────┘
                     │ HTTPS / REST API
                     │ JWT en Authorization header
┌────────────────────▼───────────────────────────────────────┐
│                     CAPA LÓGICA                            │
│                  (FastAPI - Python)                        │
├────────────────────────────────────────────────────────────┤
│  • Endpoints REST (/auth/*, /api/*)                        │
│  • AuthService (JWT, OAuth, bcrypt)                        │
│  • RoleService (asignación automática)                     │
│  • Schemas (Pydantic validation)                           │
│  • Dependencies (get_current_user)                         │
└────────────────────┬───────────────────────────────────────┘
                     │ SQL (SQLAlchemy ORM)
                     │ Connection Pool
┌────────────────────▼───────────────────────────────────────┐
│                    CAPA DATOS                              │
│              (PostgreSQL / MySQL)                          │
├────────────────────────────────────────────────────────────┤
│  Tables: users                                             │
│  Indexes: email, google_id, role                           │
│  Constraints: UNIQUE, NOT NULL                             │
└────────────────────────────────────────────────────────────┘
```

### 4.2 Flujo de Autenticación Completo

```
┌─────────────────────────────────────────────────────────────┐
│                 FLUJO GOOGLE OAUTH                          │
└─────────────────────────────────────────────────────────────┘

1. Usuario → [Click "Sign in with Google"]
2. Frontend → window.google.accounts.id.initialize()
3. Google → Muestra popup de login
4. Usuario → Ingresa credenciales en Google
5. Google → Retorna credential (JWT de Google)
6. Frontend → POST /auth/register { token: credential }
7. Backend → AuthService.verify_google_token()
8. Backend → Google API: Validar token
9. Google API → Retorna payload (email, name, picture, sub)
10. Backend → RoleService.determine_role(email)
11. Backend → Crear/actualizar User en DB
12. Backend → AuthService.create_access_token(email)
13. Backend → Retornar { access_token, user }
14. Frontend → Guardar token en localStorage
15. Frontend → Actualizar signals (currentUser, token)
16. Frontend → Router.navigate(['/dashboard'])

┌─────────────────────────────────────────────────────────────┐
│              FLUJO REGISTRO TRADICIONAL                     │
└─────────────────────────────────────────────────────────────┘

1. Usuario → Completa formulario (email, name, password)
2. Frontend → POST /auth/register-traditional { email, name, password }
3. Backend → Validar email institucional (.edu)
4. Backend → RoleService.try_determine_role_from_email()
5. Backend → AuthService.hash_password(password)  # bcrypt
6. Backend → Crear User con password_hash
7. Backend → AuthService.create_access_token(email)
8. Backend → Retornar { access_token, user }
9. Frontend → Guardar token en localStorage
10. Frontend → Router.navigate(['/dashboard'])

┌─────────────────────────────────────────────────────────────┐
│                    FLUJO LOGIN                              │
└─────────────────────────────────────────────────────────────┘

1. Usuario → Ingresa email y password
2. Frontend → POST /auth/login { email, password }
3. Backend → Buscar User por email
4. Backend → AuthService.verify_password(plain, hash)
5. Backend → Actualizar last_login = datetime.utcnow()
6. Backend → AuthService.create_access_token(email)
7. Backend → Retornar { access_token, user }
8. Frontend → Guardar token y actualizar signals
9. Frontend → Router.navigate(['/dashboard'])
```

### 4.3 Modelo de Base de Datos

```sql
┌──────────────────────────────────────────────────────────┐
│                       TABLE: users                       │
├──────────────────────────────────────────────────────────┤
│  id              INTEGER         PRIMARY KEY             │
│  email           VARCHAR(255)    UNIQUE, NOT NULL        │
│  name            VARCHAR(255)    NOT NULL                │
│  google_id       VARCHAR(255)    UNIQUE, NULLABLE        │
│  password_hash   VARCHAR(255)    NULLABLE                │
│  picture         VARCHAR(500)    NULLABLE                │
│  role            VARCHAR(50)     DEFAULT 'estudiante'    │
│  role_color      VARCHAR(7)      DEFAULT '#000000'       │
│  role_badge      VARCHAR(10)     DEFAULT ''              │
│  created_at      TIMESTAMP       DEFAULT NOW()           │
│  last_login      TIMESTAMP       NULLABLE                │
├──────────────────────────────────────────────────────────┤
│  INDEXES:                                                │
│    - idx_email ON email                                  │
│    - idx_google_id ON google_id                          │
│    - idx_role ON role                                    │
├──────────────────────────────────────────────────────────┤
│  CONSTRAINTS:                                            │
│    - email UNIQUE (no duplicados)                        │
│    - google_id UNIQUE cuando no NULL                     │
│    - google_id O password_hash debe existir              │
└──────────────────────────────────────────────────────────┘

NOTAS:
- google_id: NULL para usuarios con registro tradicional
- password_hash: NULL para usuarios con Google OAuth
- Cada usuario DEBE tener al menos uno de los dos métodos
```

---

## 5. TECNOLOGÍAS SELECCIONADAS

### 5.1 Stack Completo

```yaml
Frontend:
  Framework: Angular 20
  Language: TypeScript 5.x
  Rendering: SSR (Server-Side Rendering)
  State: Signals (native)
  HTTP: Angular HttpClient
  Server: Express.js + AngularNodeAppEngine

Backend:
  Framework: FastAPI 0.120.0
  Language: Python 3.10+
  Authentication: JWT + Google OAuth 2.0
  Password: bcrypt
  Database: PostgreSQL/MySQL
  ORM: SQLAlchemy 2.0
  Validation: Pydantic 2.12

Infrastructure:
  Server: Node.js 18+ (frontend SSR)
  Server: uvicorn (backend ASGI)
  Database: PostgreSQL 14+ / MySQL 8+
  Process Manager: PM2 (opcional)
```

### 5.2 Dependencias Backend (requirements.txt)

```python
# Core Framework
fastapi==0.120.0          # Framework web moderno
uvicorn==0.38.0           # ASGI server
pydantic==2.12.3          # Validación de datos

# Database
SQLAlchemy==2.0.44        # ORM
psycopg2-binary==2.9.11   # PostgreSQL driver

# Authentication
PyJWT==2.10.1             # JSON Web Tokens
google-auth==2.41.1       # Google OAuth verification
passlib==1.7.4            # Password hashing
bcrypt==3.2.0             # Algoritmo bcrypt

# Utilities
python-dotenv==1.2.1      # Variables de entorno
requests==2.32.5          # HTTP requests
```

### 5.3 Justificación de Tecnologías

#### 5.3.1 FastAPI vs Flask vs Django

**¿Por qué FastAPI?**

| Característica | FastAPI | Flask | Django |
|---------------|---------|-------|--------|
| Performance | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| Documentación Auto | ✅ OpenAPI | ❌ Manual | ❌ Manual |
| Async/Await | ✅ Nativo | ⚠️ Con extensions | ⚠️ Limitado |
| Type Hints | ✅ Requerido | ⚠️ Opcional | ⚠️ Opcional |
| Validación | ✅ Pydantic | ❌ Manual | ✅ Forms |
| Curva Aprendizaje | Media | Baja | Alta |

**Decisión:** FastAPI ofrece el mejor balance entre rendimiento, DX (Developer Experience) y features modernos.

#### 5.3.2 SQLAlchemy 2.0

**Ventajas:**
- ✅ ORM maduro y battle-tested
- ✅ Soporte para async/await
- ✅ Migraciones con Alembic
- ✅ Query builder type-safe
- ✅ Múltiples backends (PostgreSQL, MySQL, SQLite)

#### 5.3.3 Pydantic para Validación

```python
class UserCreate(BaseModel):
    email: EmailStr  # Valida formato email automáticamente
    name: str = Field(min_length=2, max_length=100)
    password: str = Field(min_length=8)
    
    @validator('email')
    def email_must_be_institutional(cls, v):
        if not v.endswith('.edu') and '.edu.' not in v:
            raise ValueError('Debe ser correo institucional')
        return v.lower()
```

**Beneficios:**
- Validación automática antes de llegar a la lógica de negocio
- Mensajes de error claros y consistentes
- Conversión de tipos automática
- Documentación OpenAPI generada automáticamente

---

## 6. DISEÑO E IMPLEMENTACIÓN FRONTEND

### 6.1 Arquitectura de Componentes

```
src/app/
├── guards/
│   └── auth.guard.ts                 # Protección de rutas
├── interceptors/
│   └── auth.interceptor.ts           # Inyección de JWT
├── layouts/
│   └── main-layout/
│       ├── main-layout.component.ts
│       └── main-layout.component.html
├── models/
│   └── user.model.ts                 # Interfaces TypeScript
├── services/
│   ├── auth.service.ts               # Lógica de autenticación
│   └── user.service.ts               # Operaciones de usuarios
├── shared/
│   └── components/
│       ├── cell/                     # Componentes atómicos
│       │   ├── login.component/
│       │   └── register.component/
│       └── organice/                 # Componentes compuestos
│           └── dashboard.component/
├── app.config.ts                     # Configuración Angular
├── app.routes.ts                     # Definición de rutas
└── app.ts                            # Componente raíz
```

### 6.2 Sistema de Signals (Estado Reactivo)

```typescript
// auth.service.ts
@Injectable({ providedIn: 'root' })
export class AuthService {
  // 🔒 Signals privados (fuente única de verdad)
  private currentUserSignal = signal<User | null>(null);
  private tokenSignal = signal<string | null>(null);

  // 📖 Computed signals públicos (solo lectura)
  readonly currentUser = computed(() => this.currentUserSignal());
  readonly isAuthenticated = computed(() => !!this.tokenSignal());
  readonly isAdmin = computed(() => 
    this.currentUser()?.role === 'admins'
  );
  readonly isTeacher = computed(() => 
    this.currentUser()?.role === 'teachers'
  );

  constructor() {
    this.loadStoredAuth();
    
    // Effect para debugging
    effect(() => {
      const user = this.currentUser();
      if (user) {
        console.log('👤 Usuario actual:', user.name, user.role);
      }
    });
  }

  // Cargar autenticación desde localStorage
  private loadStoredAuth(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const token = localStorage.getItem('access_token');
    const user = localStorage.getItem('user');

    if (token && user) {
      this.tokenSignal.set(token);
      this.currentUserSignal.set(JSON.parse(user));
    }
  }

  // Actualizar estado tras login/registro
  private setAuth(response: AuthResponse): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    // Actualizar signals (triggerea re-renders automáticos)
    this.tokenSignal.set(response.access_token);
    this.currentUserSignal.set(response.user);
  }
}
```

**Ventajas de Signals sobre RxJS:**
- ✅ Más simple y directo
- ✅ Mejor performance (no hay Zone.js)
- ✅ Menos boilerplate
- ✅ Integrado nativamente en Angular 20

### 6.3 HTTP Interceptor para JWT

```typescript
// auth.interceptor.ts
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  // No agregar token a endpoints de autenticación
  if (req.url.includes('/auth/login') || 
      req.url.includes('/auth/register')) {
    return next(req);
  }

  // Agregar token si existe
  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return next(cloned);
  }

  return next(req);
};
```

### 6.4 Guards de Protección

```typescript
// auth.guard.ts
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Guardar URL para redirigir después del login
  router.navigate(['/login'], {
    queryParams: { returnUrl: state.url }
  });
  
  return false;
};

// Guard avanzado por roles
export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const user = authService.currentUser();

    if (user && allowedRoles.includes(user.role)) {
      return true;
    }

    // Mostrar página de acceso denegado
    router.navigate(['/unauthorized']);
    return false;
  };
};
```

**Uso en rutas:**
```typescript
export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard]  // Solo usuarios autenticados
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [authGuard, roleGuard(['admins'])]  // Solo admins
  }
];
```

### 6.5 Server-Side Rendering (SSR)

```typescript
// server.ts
import { AngularNodeAppEngine, writeResponseToNodeResponse } from '@angular/ssr/node';
import express from 'express';
import { buildSecurityHeaders } from './ssr/security-headers';

const app = express();
const angularApp = new AngularNodeAppEngine();

// Aplicar headers de seguridad
app.use((req, res, next) => {
  const env = process.env.NODE_ENV === 'production' ? 'prod' : 'dev';
  const headers = buildSecurityHeaders(env);
  
  Object.entries(headers).forEach(([key, value]) => {
    res.setHeader(key, value);
  });
  
  next();
});

// Servir archivos estáticos con cache
app.use(express.static(browserDistFolder, {
  maxAge: '1y',      // Cache 1 año para assets
  index: false,
  redirect: false
}));

// Renderizar aplicación Angular
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then(response => 
      response ? writeResponseToNodeResponse(response, res) : next()
    )
    .catch(next);
});

// Iniciar servidor
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
```

**Beneficios del SSR:**
- 🔍 SEO optimizado (Google indexa el HTML completo)
- ⚡ Faster First Contentful Paint
- 📱 Mejor experiencia en dispositivos de baja gama
- 🌐 Funciona incluso con JS deshabilitado (parcialmente)

---

## 7. DISEÑO E IMPLEMENTACIÓN BACKEND

### 7.1 Estructura del Proyecto Backend

```
backend/
├── index.py                 # Punto de entrada FastAPI
├── config.py                # Configuración y variables de entorno
├── database.py              # Configuración de BD y engine
├── models.py                # Modelos SQLAlchemy (User)
├── schemas.py               # Schemas Pydantic (validación)
├── auth_service.py          # Lógica de autenticación
├── role_service.py          # Sistema de roles automático
├── dependencies.py          # Dependency injection (get_current_user)
├── check_and_fix_database.py  # Script de verificación BD
├── requirements.txt         # Dependencias Python
├── .env                     # Variables de entorno (no en git)
└── .env.example             # Ejemplo de configuración
```

### 7.2 Configuración (config.py)

```python
from pathlib import Path
import os
from dotenv import load_dotenv

# Cargar .env automáticamente
env_path = Path(__file__).parent / ".env"
if env_path.exists():
    load_dotenv(dotenv_path=env_path)

class Settings:
    def __init__(self):
        # Google OAuth
        self.GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
        self.GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")

        # JWT
        self.SECRET_KEY = os.getenv("SECRET_KEY", "CHANGE-ME-IN-PRODUCTION")
        self.ACCESS_TOKEN_EXPIRE_SECONDS = int(
            os.getenv("ACCESS_TOKEN_EXPIRE_SECONDS", "3600")
        )

        # Database
        self.DATABASE_HOST = os.getenv("DATABASE_HOST", "localhost")
        self.DATABASE_PORT = os.getenv("DATABASE_PORT", "5432")
        self.DATABASE_USER = os.getenv("DATABASE_USER")
        self.DATABASE_PASSWORD = os.getenv("DATABASE_PASSWORD")
        self.DATABASE_NAME = os.getenv("DATABASE_NAME")
        self.DATABASE_URL = os.getenv("DATABASE_URL")  # URL completa opcional

settings = Settings()
```

**Archivo .env ejemplo:**
```env
# Google OAuth
GOOGLE_CLIENT_ID=tu-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=tu-client-secret

# JWT
SECRET_KEY=tu-secret-key-super-segura-256-bits
ACCESS_TOKEN_EXPIRE_SECONDS=3600

# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=tu-password
DATABASE_NAME=avisus_db

# O usar URL completa
# DATABASE_URL=postgresql://user:pass@localhost:5432/avisus_db
```

### 7.3 Modelos SQLAlchemy (models.py)

```python
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    # Identificación
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    
    # Autenticación
    google_id = Column(String, unique=True, index=True, nullable=True)
    password_hash = Column(String, nullable=True)
    
    # Perfil
    picture = Column(String, nullable=True)
    
    # Sistema de roles
    role = Column(String, nullable=True, default="estudiante")
    role_color = Column(String, nullable=True, default="#000000")
    role_badge = Column(String, nullable=True, default="")
    
    # Auditoría
    created_at = Column(DateTime, default=datetime.utcnow)
    last_login = Column(DateTime, nullable=True)
    
    def __repr__(self):
        return f"<User {self.email} role={self.role}>"
```

**Diseño de la tabla:**
- `google_id` y `password_hash` son opcionales (nullable=True)
- Cada usuario debe tener AL MENOS uno de los dos
- Índices en `email`, `google_id` y `role` para queries rápidas

### 7.4 Schemas Pydantic (schemas.py)

```python
from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class UserBase(BaseModel):
    email: EmailStr
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
        from_attributes = True  # Permite convertir desde ORM

class TokenResponse(BaseModel):
    access_token: str
    