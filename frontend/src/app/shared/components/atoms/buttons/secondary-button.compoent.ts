import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-secondary-button',
  standalone: true,
  imports: [NgClass],
  template: `
    <button
      [type]="type"
      [disabled]="disabled"
      (click)="onClick.emit($event)"
      class="secondary-button"
      [ngClass]="{'secondary-button--disabled': disabled}"
    >
      <ng-content></ng-content>
    </button>
  `,
  styles: [
    `
    .secondary-button {
      padding: 0.75rem 1.5rem;
      border-radius: 0.375rem;
      font-weight: 600;
      background-color: white;
      color: #3b82f6;
      border: none;
      outline: 1px solid #3b82f6;
      cursor: pointer;
      transition: all 0.2s ease-in-out;
    }

    .secondary-button:hover:not(:disabled) {
      color: #2563eb;
      transform: translateY(-1px);
      outline: 2px solid;
    }

    .secondary-button:active:not(:disabled) {
      transform: translateY(0);
    }

    .secondary-button--disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `
  ,]
})
export class SecondaryButtonComponent {
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled = false;
  @Output() onClick = new EventEmitter<MouseEvent>();
}
