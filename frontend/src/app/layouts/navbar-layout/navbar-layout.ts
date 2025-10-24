import { Component, Output, EventEmitter } from '@angular/core'; // <-- 1. Agregamos Output y EventEmitter
import { HamburgerButton } from '../../shared/components/atoms/hamburger-button/hamburger-button';
import { PrimaryButtonComponent } from "../../shared/components/atoms/buttons/primary-button.component";

@Component({
  selector: 'app-navbar-layout',
  standalone: true,
  imports: [HamburgerButton, PrimaryButtonComponent],
  templateUrl: './navbar-layout.html',
  styleUrl: './navbar-layout.css'
})
export class NavbarLayout {
    
    // 2. Definimos el Output para notificar al componente padre que se presiona el botón.
    // 'menuToggle' es el nombre del evento.
    @Output() menuToggle = new EventEmitter<void>(); 

    constructor() {}

    // 3. Método que será llamado cuando el botón de hamburguesa sea clickeado en el HTML.
    onMenuClick() {
        this.menuToggle.emit();
    }
}