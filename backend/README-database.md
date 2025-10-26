# Scripts SQL para Base de Datos

Este directorio contiene scripts SQL para crear y poblar la base de datos PostgreSQL.

## 📁 Archivos

- `init_database.sql` - Script para crear la estructura de la base de datos
- `seed_database.sql` - Script para insertar datos de ejemplo (solo desarrollo)

## 🚀 Uso Rápido

### Opción 1: Ejecutar con psql

```bash
# Conectar a PostgreSQL
psql -U postgres

# Crear base de datos (si no existe)
CREATE DATABASE utma_role_system;
\c utma_role_system

# Ejecutar script de creación
\i init_database.sql

# (Opcional) Ejecutar seed con datos de ejemplo
\i seed_database.sql
```

### Opción 2: Ejecutar desde línea de comandos

```bash
# Crear base de datos
psql -U postgres -c "CREATE DATABASE utma_role_system;"

# Ejecutar script de creación
psql -U postgres -d utma_role_system -f init_database.sql

# (Opcional) Ejecutar seed
psql -U postgres -d utma_role_system -f seed_database.sql
```

### Opción 3: Usar Railway CLI (si estás usando Railway)

```bash
# Conectar a la base de datos de Railway
railway run psql

# Dentro de psql:
\i init_database.sql
\i seed_database.sql
```

## 🔧 Estructura de la Tabla `users`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | SERIAL | ID único del usuario (auto-incremento) |
| `email` | VARCHAR(255) | Email único (debe ser institucional .edu) |
| `name` | VARCHAR(255) | Nombre completo |
| `google_id` | VARCHAR(255) | ID de Google OAuth (nullable) |
| `picture` | VARCHAR(500) | URL de la foto de perfil |
| `password_hash` | VARCHAR(255) | Hash bcrypt de la contraseña (nullable) |
| `role` | VARCHAR(50) | Rol: students, teachers, admins, grupsBoss |
| `role_color` | VARCHAR(7) | Color hexadecimal del rol |
| `role_badge` | VARCHAR(10) | Emoji o badge del rol |
| `created_at` | TIMESTAMP | Fecha de creación |
| `last_login` | TIMESTAMP | Último inicio de sesión |

## 🎭 Roles Disponibles

- **students** (#10B981 🎓) - Estudiantes
- **teachers** (#8B5CF6 📚) - Docentes
- **admins** (#EF4444 👔) - Administrativos
- **grupsBoss** (#F59E0B 👨‍💼) - Jefes de grupo
- **dev** (#3B82F6 💻) - Desarrolladores

## 🔐 Credenciales de Ejemplo

El script `seed_database.sql` inserta usuarios de ejemplo con la contraseña: **`password123`**

⚠️ **IMPORTANTE**: Estos usuarios son solo para desarrollo. En producción, usa el endpoint de registro.

## 📋 Índices Creados

- `idx_users_email` - Índice en email
- `idx_users_google_id` - Índice en google_id
- `idx_users_role` - Índice en role
- `idx_users_last_login` - Índice en last_login

## ✅ Verificar Instalación

```sql
-- Ver estructura de la tabla
\d users

-- Ver todos los usuarios
SELECT id, email, name, role, role_color, role_badge FROM users;

-- Ver índices
\di idx_users_*
```

## 🔄 Actualizar Schema

Si necesitas actualizar el schema después de cambios en `models.py`:

```bash
# SQLAlchemy generará las migraciones automáticamente al arrancar la app
# O puedes ejecutar manualmente:

# Conectarse a la base de datos
psql -U postgres -d utma_role_system

# Ver la estructura actual
\d users

# Si necesitas agregar columnas, puedes hacer ALTER TABLE
ALTER TABLE users ADD COLUMN new_column VARCHAR(255);
```

## 🗑️ Resetear Base de Datos (CUIDADO)

```sql
-- ⚠️ SOLO EN DESARROLLO
DROP TABLE IF EXISTS users CASCADE;
\i init_database.sql
\i seed_database.sql
```

## 📝 Notas Importantes

1. **Email debe ser institucional** - La validación está en el backend
2. **password_hash puede ser NULL** - Para usuarios solo con Google OAuth
3. **google_id puede ser NULL** - Para usuarios solo con login tradicional
4. **role tiene valores por defecto** - Pero se asigna automáticamente según el correo

## 🌐 Usuarios de Prueba

Después de ejecutar `seed_database.sql`, puedes probar login con:

- **Email**: `utm231313@utma.edu.mx` - **Password**: `password123`
- **Email**: `juan.perez@utma.edu.mx` - **Password**: `password123`
- **Email**: `admin.direccion@utma.edu.mx` - **Password**: `password123`
- **Email**: `utm221100@utma.edu.mx` - **Password**: `password123`

