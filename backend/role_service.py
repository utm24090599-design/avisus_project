import re
from typing import Tuple, List

class RoleService:
    ROLES = {
        "dev": {
            "name": "Desarrolladores",
            "color": "#3B82F6",
            "badge": "💻"
        },
        "admins": {
            "name": "Administrativos",
            "color": "#EF4444",
            "badge": "👔"
        },
        "students": {
            "name": "Estudiantes",
            "color": "#10B981",
            "badge": "🎓"
        },
        "grupsBoss": {
            "name": "Jefes de grupos",
            "color": "#F59E0B",
            "badge": "👨‍💼"
        },
        "teachers": {
            "name": "Docentes",
            "color": "#8B5CF6",
            "badge": "📚"
        }
    }
    
    @staticmethod
    def determine_role(email: str) -> Tuple[str, str, str]:
        """Determina el rol basándose en el patrón del correo"""
        email = (email or "").lower().strip()
        
        if not email.endswith('@utma.edu.mx'):
            raise ValueError('El correo debe ser del dominio @utma.edu.mx')
        
        local_part = email.split('@')[0]
        
        # Patrón estudiante: utm + números (students por defecto)
        if re.match(r'^utm\d+$', local_part):
            role_info = RoleService.ROLES["students"]
            return ("students", role_info["color"], role_info["badge"])
        
        # Patrón nombre.apellido (teachers por defecto)
        if re.match(r'^[a-z]+\.[a-z]+$', local_part):
            role_info = RoleService.ROLES["teachers"]
            return ("teachers", role_info["color"], role_info["badge"])
        
        raise ValueError("Formato de correo no reconocido")
    
    @staticmethod
    def get_allowed_roles(email: str) -> List[str]:
        email = (email or "").lower().strip()

        # estudiante pattern: starts with utm digits and domain utma.edu.mx
        if re.match(r"^utm\d+@utma\.edu\.mx$", email):
            return ["students", "grupsBoss"]

        # profesor/administrativo pattern: firstname.lastname@utma.edu.mx
        if re.match(r"^[a-z]+\.[a-z]+@utma\.edu\.mx$", email):
            return ["teachers", "admins"]

        # fallback: no roles
        return []
    
    @staticmethod
    def is_institutional_email(email: str) -> bool:
        """Determina si un correo es institucional basándose en dominios .edu"""
        email = (email or "").lower().strip()
        
        # Dominios institucionales comunes
        institutional_domains = [
            '@utma.edu.mx',  # Universidad específica
            '@edu.mx',        # Dominios educativos de México
            '.edu'            # Cualquier dominio .edu
        ]
        
        # Verificar si contiene alguna extensión educativa
        return any(email.endswith(domain) for domain in institutional_domains) or '.edu.' in email
    
    @staticmethod
    def try_determine_role_from_email(email: str) -> Tuple[str, str, str]:
        """
        Intenta determinar el rol desde un correo, incluso si no es @utma.edu.mx.
        Si no puede determinar el rol, retorna un rol por defecto.
        """
        email = (email or "").lower().strip()
        
        # Primero intentar con el formato UTMA
        try:
            return RoleService.determine_role(email)
        except ValueError:
            pass
        
        # Si es correo institucional genérico pero no UTMA, asignar rol por defecto
        if RoleService.is_institutional_email(email):
            # Por defecto, correos institucionales no-UTMA son teachers/admins
            role_info = RoleService.ROLES["teachers"]
            return ("teachers", role_info["color"], role_info["badge"])
        
        # Si es correo personal, no asignar rol (debe ser rechazado)
        raise ValueError("Correos personales no permitidos. Debes usar un correo institucional")