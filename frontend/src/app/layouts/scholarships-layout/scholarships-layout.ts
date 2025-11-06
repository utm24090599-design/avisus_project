import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardLayout } from '../card-layout/card-layout';


@Component({
  selector: 'app-scholarships-layout',
  imports: [CommonModule, CardLayout],
  templateUrl: './scholarships-layout.html',
  styleUrl: './scholarships-layout.css'
})
export class ScholarshipsLayout {
  protected readonly title = signal('Avisus');


  avisos = [
    {
      titulo: 'Evento de Amongus',
      descripcion: 'Instala Amongus aun si no tienes espacio, borra mensajes',
      fecha: 'Todas las clases'
    },
    {
      titulo: 'Bienvenidos al himalaya!!!! Helado',
      descripcion: 'Invita las nieves causa, no hay dinero :v',
      fecha: 'Cada que puedas'
    },
    {
      titulo: 'Quien quiere Pizza',
      descripcion: 'Pues compra XD',
      fecha: '10103000'
    }
  ];


  avisosVisibles = signal(3);

  verMas() {

    this.avisos = [...this.avisos, ...this.avisos.slice(0, 3)];
    this.avisosVisibles.set(this.avisos.length);
  }
}
