import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Avisus');

 
  avisos = [
    {
      titulo: 'Limon ha empeñado su moto',
      descripcion: 'La moto rancia de limon ha sido empeñada un total de 879 veces',
      fecha: 'siempre'
    },
    {
      titulo: 'Avisus te avisa que:',
      descripcion: 'SiS',
      fecha: 'hoy'
    },
    {
      titulo: 'ajoliñolaleñoun',
      descripcion: 'Sigma',
      fecha: ' 90 oct 379809'
    }
  ];

 
  avisosVisibles = signal(3);

  verMas() {

    this.avisos = [...this.avisos, ...this.avisos.slice(0, 3)];
    this.avisosVisibles.set(this.avisos.length);
  }
}
