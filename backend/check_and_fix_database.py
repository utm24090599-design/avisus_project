#!/usr/bin/env python3
"""
Script para verificar y arreglar la estructura de la base de datos
"""

from sqlalchemy import create_engine, inspect, text
from database import DATABASE_URL
import sys

def check_and_fix_database():
    print("[INFO] Verificando base de datos...")
    
    try:
        engine = create_engine(DATABASE_URL)
        with engine.connect() as conn:
            # Verificar si la tabla users existe
            inspector = inspect(engine)
            tables = inspector.get_table_names()
            
            if 'users' not in tables:
                print("[ERROR] La tabla 'users' no existe. Creando...")
                from models import Base
                Base.metadata.create_all(bind=engine)
                print("[OK] Tabla 'users' creada exitosamente")
            else:
                print("[OK] La tabla 'users' existe")
            
            # Verificar columnas
            columns = [col['name'] for col in inspector.get_columns('users')]
            print(f"\n[INFO] Columnas actuales: {columns}")
            
            # Verificar si falta password_hash
            if 'password_hash' not in columns:
                print("\n[WARNING] Falta la columna 'password_hash'. Agregando...")
                conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255)"))
                conn.commit()
                print("[OK] Columna 'password_hash' agregada")
            
            # Verificar google_id es nullable
            try:
                conn.execute(text("""
                    ALTER TABLE users 
                    ALTER COLUMN google_id DROP NOT NULL;
                """))
                conn.commit()
            except Exception as e:
                print(f"[INFO] google_id ya es nullable: {e}")
            
            # Verificar última estructura
            columns_after = [col['name'] for col in inspector.get_columns('users')]
            print(f"\n[OK] Columnas finales: {columns_after}")
            
            # Contar usuarios
            result = conn.execute(text("SELECT COUNT(*) FROM users"))
            count = result.scalar()
            print(f"\n[INFO] Total de usuarios: {count}")
            
            print("\n[OK] Base de datos verificada y arreglada exitosamente!")
            
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    check_and_fix_database()

