import { Routes } from '@angular/router';
import { LoginComponent } from './shared/components/cell/login.component/login.component';
import { RegisterComponent } from './shared/components/cell/register.component/register.component';
import { DashboardComponent } from './shared/components/organice/dashboard.component/dashboard.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    children: [
      // {
      //   path: '',
      //   redirectTo: 'home',
      //   pathMatch: 'full',
      // },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      {
        path: '',
        component: DashboardComponent,
        canActivate: [authGuard],
      },
    ],
  },
];
