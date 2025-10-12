import { Component, Input, Output, EventEmitter, input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-danger-button',
  standalone: true,
  imports: [NgClass],
  template: `
    <button
      [type]="type"
      [disabled]="disabled"
      (click)="onClick.emit($event)"
      class="danger-button"
      [ngClass]="{'danger-button--disabled': disabled}"
    >
      <ng-content></ng-content>
    </button>
  `,
  styles: [
    `
    .danger-button {
      padding: 0.75rem 1.5rem;
      border-radius: 0.375rem;
      font-weight: 600;
      background-color: red;
      color: white;
      border: none;
      cursor: pointer;
      transition: all 0.2s ease-in-out;
    }

    .danger-button:hover:not(:disabled) {
      background-color: #bb0000ff;
      transform: translateY(-1px);
    }

    .danger-button:active:not(:disabled) {
      transform: translateY(0);
    }

    .danger-button--disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `
  ,]
})
export class dangerButtonComponent {
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled = false;
  @Output() onClick = new EventEmitter<MouseEvent>();

  @Input() isRotateItem: boolean = false;
  @Input() rotationDegrees: number = 0;
}
