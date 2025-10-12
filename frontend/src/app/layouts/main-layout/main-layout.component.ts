import { Component } from '@angular/core';
import { NavbarLayout } from '../navbar-layout/navbar-layout';
import { RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [NavbarLayout, RouterOutlet],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent {
  constructor() {}
}
