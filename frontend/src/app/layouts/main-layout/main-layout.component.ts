// src/app/layouts/main-layout/main-layout.ts

import { Component } from '@angular/core';
import { NavbarLayout } from '../navbar-layout/navbar-layout';
import { RouterOutlet } from "@angular/router";
import { SidebarLayoutComponent } from '../sidebar-layout/sidebar-layout'; 
import { CommonModule } from '@angular/common'; // <-- ¡Añade esta línea!

@Component({
  selector: 'app-main-layout',
  standalone: true,
  // Añade CommonModule al array de imports
  imports: [NavbarLayout, RouterOutlet, SidebarLayoutComponent, CommonModule], 
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent {
    
    // 3. Estado: Variable para controlar la visibilidad del sidebar (cerrado por defecto)
    isSidebarOpen: boolean = false;

    // 4. Función para Abrir/Cerrar (llamada desde el Navbar al hacer clic en el botón)
    toggleSidebar() {
        this.isSidebarOpen = !this.isSidebarOpen; // Invierte el estado
    }

    // 5. Función para Cerrar (llamada desde la 'X' dentro del Sidebar)
    closeSidebar() {
        this.isSidebarOpen = false;
    }
    
    constructor() {}
}