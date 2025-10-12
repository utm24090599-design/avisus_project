import { Component } from '@angular/core';
import { HamburgerButton } from '../../shared/components/atoms/hamburger-button/hamburger-button';
import { PrimaryButtonComponent } from "../../shared/components/atoms/buttons/primary-button.component";

@Component({
  selector: 'app-navbar-layout',
  standalone: true,
  imports: [HamburgerButton, PrimaryButtonComponent],
  templateUrl: './navbar-layout.html',
  styleUrl: './navbar-layout.css'
})
export class NavbarLayout {
  constructor() {}
}
