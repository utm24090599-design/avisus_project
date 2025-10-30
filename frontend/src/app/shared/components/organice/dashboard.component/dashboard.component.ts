import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../services/auth.service';
import { UserService } from '../../../../services/user.service';
import { User } from '../../../../models/user.model';
import { NewsLayout } from '../../../../layouts/news-layout/news-layout';

interface Filter {
  id: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NewsLayout],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private userService = inject(UserService);

  // Signals
  readonly allUsers = signal<User[]>([]);
  readonly selectedFilter = signal<string>('all');
  readonly isLoadingUsers = signal(false);

  // Computed signals
  readonly currentUser = this.authService.currentUser;
  readonly filteredUsers = computed(() => {
    const filter = this.selectedFilter();
    const users = this.allUsers();

    if (filter === 'all') {
      return users;
    }
    return users.filter(user => user.role === filter);
  });

  readonly roleNames: Record<string, string> = {
    'students': 'Estudiante',
    'teachers': 'Docente',
    'admins': 'Administrativo',
    'grupsBoss': 'Jefe de Grupo',
    'dev': 'Desarrollador'
  };

  readonly filters: Filter[] = [
    { id: 'all', label: 'Todos', icon: '👥' },
    { id: 'students', label: 'Estudiantes', icon: '🎓' },
    { id: 'teachers', label: 'Docentes', icon: '📚' },
    { id: 'admins', label: 'Administrativos', icon: '👔' },
    { id: 'grupsBoss', label: 'Jefes de Grupo', icon: '👨‍💼' },
    { id: 'dev', label: 'Desarrolladores', icon: '💻' }
  ];

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.isLoadingUsers.set(true);
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.allUsers.set(users);
        this.isLoadingUsers.set(false);
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.isLoadingUsers.set(false);
      }
    });
  }

  filterUsers(role: string) {
    this.selectedFilter.set(role);
  }

  getRoleName(role: string): string {
    return this.roleNames[role] || role;
  }

  logout() {
    this.authService.logout();
  }
}
