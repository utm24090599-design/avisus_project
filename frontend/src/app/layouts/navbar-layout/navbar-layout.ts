import { Component, Output, EventEmitter, HostListener, signal, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HamburgerButton } from '../../shared/components/atoms/hamburger-button/hamburger-button';
import { PrimaryButtonComponent } from "../../shared/components/atoms/buttons/primary-button.component";
import { Router } from '@angular/router';


@Component({
  selector: 'app-navbar-layout',
  standalone: true,
  imports: [HamburgerButton, PrimaryButtonComponent],
  templateUrl: './navbar-layout.html',
  styleUrl: './navbar-layout.css'
})
export class NavbarLayout {
    private platformId = inject(PLATFORM_ID);
    private isBrowser: boolean;
    
    @Output() menuToggle = new EventEmitter<void>(); 

    isNavbarVisible = signal(true);
    private lastScrollTop = 0;
    private scrollThreshold = 10;

    constructor(private router: Router) {
      this.isBrowser = isPlatformBrowser(this.platformId);
    }

    @HostListener('window:scroll')
    onWindowScroll() {
      if (!this.isBrowser) return;

      const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
      
      // Si estamos en la parte superior, siempre mostrar
      if (currentScroll <= 0) {
        this.isNavbarVisible.set(true);
        return;
      }

      // Detectar dirección del scroll
      if (Math.abs(currentScroll - this.lastScrollTop) < this.scrollThreshold) {
        return;
      }

      if (currentScroll > this.lastScrollTop) {
        // Scrolling down
        this.isNavbarVisible.set(false);
      } else {
        // Scrolling up
        this.isNavbarVisible.set(true);
      }

      this.lastScrollTop = currentScroll;
    }

    onMenuClick() {
        this.menuToggle.emit();
    }

    onLogingClick(){
      this.router.navigate(['/login']);
    }
}