import { App } from './../../../../app';
import { Component, Input, Output, EventEmitter, input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-icon-button',
  standalone: true,
  imports: [NgClass],
  template: `
    <button
      [type]="type"
      [disabled]="disabled"
      (click)="onClick.emit($event)"
      class="icon-button"
      [ngClass]="{'icon-button--disabled': disabled}"
    >
      <ng-content></ng-content>
    </button>
  `,
  styles: [
    `
    .icon-button {
      border-radius: 0.375rem;
      font-weight: 600;
      height: 100%;
      width: 100%;
      background-color: transparent;
      border: none;
      cursor: pointer;
      transition: all 0.2s ease-in-out;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.5rem;
    }

    .icon-button:hover:not(:disabled) {
      background-color: #00000042;
      transform: translateY(-1px);
    }

    .icon-button--disabled {
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
