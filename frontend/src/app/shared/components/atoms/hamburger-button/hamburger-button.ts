import { Component } from '@angular/core';
import { dangerButtonComponent } from "../buttons/icon-button.component";

@Component({
  selector: 'app-hamburger-button',
  standalone: true,
  imports: [dangerButtonComponent],
  templateUrl: './hamburger-button.html',
  styleUrl: './hamburger-button.css'
})
export class HamburgerButton {
  constructor() {}
}
