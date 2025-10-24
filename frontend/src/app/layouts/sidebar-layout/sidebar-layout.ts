// src/app/layouts/sidebar-layout/sidebar-layout.ts

import { Component, Output, EventEmitter } from '@angular/core'; // <-- 1. ¡Importar esto es clave!

@Component({
  selector: 'app-sidebar-layout',
  templateUrl: './sidebar-layout.html',
  styleUrls: ['./sidebar-layout.css']
})
export class SidebarLayoutComponent { // <-- La clase que representa el tipo 'SidebarLayout'
  
  // 2. Definir el Output para que el componente padre (AppComponent) pueda escucharlo.
  @Output() close = new EventEmitter<void>();

  // 3. Definir la función closeSidebar() que es llamada por el (click) del HTML.
  closeSidebar() {
    // 4. Emitir el evento 'close' para que el componente principal sepa que debe cerrarse.
    this.close.emit();
  }
}