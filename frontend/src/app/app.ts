import { Component, signal } from '@angular/core';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { PrimaryButtonComponent } from './shared/components/atoms/buttons/primary-button.component';
import { SecondaryButtonComponent } from "./shared/components/atoms/buttons/secondary-button.compoent";
import { dangerButtonComponent } from "./shared/components/atoms/buttons/danger-button.component";
import { rotativeIconSpanComponent } from './shared/components/atoms/buttons/rotative-span-icon.component';
import {  labelButtonRotateIconComponent } from "./shared/components/atoms/buttons/label-button-rotate-icon.component";

@Component({
  selector: 'app-root',
  imports: [MainLayoutComponent, PrimaryButtonComponent, SecondaryButtonComponent, dangerButtonComponent, labelButtonRotateIconComponent, rotativeIconSpanComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');
}
