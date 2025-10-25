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
        if not email.endswith('@utma.edu.mx'):
            raise ValueError('El correo debe ser del dominio @utma.edu.mx')
        
        local_part = email.split('@')[0]
        
        # Patrón estudiante: utm + 10 dígitos
        if re.match(r'^utm\d{10}$', local_part):
            role_info = RoleService.ROLES["students"]
            return ("students", role_info["color"], role_info["badge"])
        
        # Patrón nombre.apellido
        if '.' in local_part:
            role_info = RoleService.ROLES["teachers"]
            return ("teachers", role_info["color"], role_info["badge"])
        
        raise ValueError("Formato de correo no reconocido")
    
    @staticmethod
    def get_allowed_roles(email: str) -> List[str]:
        email = (email or "").lower().strip()

        # estudiante pattern: starts with utm digits and domain utma.edu.mx
        if re.match(r"^utm\d+@utma\.edu\.mx$", email):
            return ["estudiante", "jefe de grupo"]

        # profesor pattern: firstname.lastname@utm.edu.mx or domain utm.edu.mx
        if email.endswith("@utm.edu.mx"):
            return ["administrador", "trabajador de servicios", "docente"]

        # fallback: no roles
        return []