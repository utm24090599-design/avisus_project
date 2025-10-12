import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RotationServiseTs } from './rotation.servise.ts.js';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-rotative-icon-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span
      class="rotative-span-icon"
      [style.transform]="'rotate(' + currentRotation + 'deg)'"
      [style.--rotation-deg.deg]="rotationDegrees"
    >
    <ng-content></ng-content>
  </span>
  `,
  styles: [
    `
    .rotative-span-icon {
    display: inline-block;
    padding: 5px 5.5px;
    border-radius: 0.375rem;
    font-weight: 600;
    background-color: transparent;
    color: black;
    border: none;
    transition: all 0.2s ease-in-out;
    user-select: none;
  }

  `
  ],
})
export class rotativeIconSpanComponent  implements OnInit, OnDestroy {
  @Input() rotationDegrees: number = 180; // El incremento en grados

  // Nuevo: Almacena el ángulo de rotación actual (empieza en 0)
  currentRotation: number = 0;

  private rotationSubscription: Subscription | undefined;

  constructor(private rotationService: RotationServiseTs) {}

  ngOnInit(): void {
    // Al recibir el evento, suma el ángulo de rotación
    this.rotationService.rotationToggled$.subscribe(() => {
      this.currentRotation += this.rotationDegrees;
    });
  }

  ngOnDestroy(): void {
    this.rotationSubscription?.unsubscribe();
  }
}
