// src/app/app.routes.ts

import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: '',
    // ELIMINA LA LÍNEA component: MainLayoutComponent,
    // component: MainLayoutComponent, // <--- ¡Comentar o Eliminar esta línea!
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      }
    ]
  }
];