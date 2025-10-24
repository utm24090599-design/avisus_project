// src/app/app.ts

import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router'; 
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component'; // <-- ¡Devolver el Layout!

@Component({
  selector: 'app-root',
  // DEJAR SOLO ESTAS DOS IMPORTACIONES
  imports: [RouterOutlet, MainLayoutComponent], 
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');
}