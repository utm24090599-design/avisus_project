# Instalación de Dependencias

Este proyecto requiere diferentes archivos de requirements según el ambiente.

## 📦 Archivos de Requirements

### `requirements.txt` - Desarrollo Local
Usado para desarrollo en tu máquina local.

**Instalación:**
```bash
# Crear y activar entorno virtual (si no existe)
python -m venv .venv

# Windows
.venv\Scripts\activate

# Linux/Mac
source .venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt
```

**Incluye:**
- `uvicorn` - Servidor ASGI para desarrollo
- `fastapi` - Framework web
- Todas las demás dependencias

### `requirements-vercel.txt` - Despliegue en Vercel
Usado para despliegue en Vercel (serverless).

**Características:**
- Incluye `mangum` - Adaptador para serverless
- No incluye `uvicorn` (Vercel lo maneja internamente)
- Optimizado para serverless functions

**Vercel automáticamente usa este archivo** cuando detecta un archivo Python en `api/`.

## 🚀 Uso

### Desarrollo Local

1. Instala dependencias locales:
```bash
pip install -r requirements.txt
```

2. Inicia el servidor:
```bash
uvicorn api.index:app --reload
```

3. Accede a: `http://localhost:8000`

### Despliegue en Vercel

1. El archivo `requirements-vercel.txt` se usará automáticamente
2. Vercel detecta el archivo en `api/index.py`
3. El handler de Mangum manejará las requests

## 🔧 Estructura de Archivos

```
backend/
├── requirements.txt              # Desarrollo local
├── requirements-vercel.txt       # Vercel (serverless)
├── api/
│   └── index.py                  # FastAPI app + Mangum handler
├── vercel.json                   # Config de Vercel
└── README-requirements.md        # Esta guía
```

## 📝 Notas Importantes

- **No mezcles** las dependencias. Usa el archivo correcto para cada ambiente.
- El archivo `requirements-vercel.txt` es necesario solo para despliegue.
- Para desarrollo local, usa `requirements.txt`.

