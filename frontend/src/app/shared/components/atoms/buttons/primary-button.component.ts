import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-primary-button',
  standalone: true,
  imports: [NgClass],
  template: `
    <button
      [type]="type"
      [disabled]="disabled"
      (click)="onClick.emit($event)"
      class="primary-button"
      [ngClass]="{ 'primary-button--disabled': disabled }"
    >
      <ng-content></ng-content>
    </button>
  `,
  styles: [
    `
      .primary-button {
        padding: 0.75rem 1.5rem;
        border-radius: 0.375rem;
        font-weight: 600;
        background-color: #3b82f6;
        color: white;
        border: none;
        cursor: pointer;
        transition: all 0.2s ease-in-out;
      }

      .primary-button:hover:not(:disabled) {
        background-color: #2563eb;
        transform: translateY(-1px);
      }

      .primary-button:active:not(:disabled) {
        transform: translateY(0);
      }

      .primary-button--disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    `,
  ],
})
export class PrimaryButtonComponent {
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled = false;
  @Output() onClick = new EventEmitter<MouseEvent>();
}
