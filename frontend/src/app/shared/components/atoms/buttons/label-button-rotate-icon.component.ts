import { Component, Input } from '@angular/core';
import { RotationServiseTs } from './rotation.servise.ts';

@Component({
  selector: 'app-label-button-rotate-icon-button',
  standalone: true,
  template: `
    <label
      (click)="onClick()"
      class="label-button-rotate-icon-button"
    >
      {{labelText}}
</label>
  `,
  styles: [
    `
    .label-button-rotate-icon-button {
      padding: 5px 5.5px;
      border-radius: 0.375rem;
      font-weight: 600;
      background-color: transparent;
      color: black;
      border: none;
      cursor: pointer;
      transition: all 0.2s ease-in-out;
      user-select: none;
    }

    .label-button-rotate-icon-button:hover:not(:disabled) {
      background-color: gray;
      transform: translateY(-1px);
      color: white;
    }

  `
  ,]
})
export class labelButtonRotateIconComponent {
  @Input() labelText: string = '';
  constructor(private rotationService: RotationServiseTs) {}

  onClick(): void {
    this.rotationService.toggleRotation();
  }

}
