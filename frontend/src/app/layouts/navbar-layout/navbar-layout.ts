import {
  Component,
  Output,
  EventEmitter,
  HostListener,
  inject,
  PLATFORM_ID,
  signal,
  computed
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { HamburgerButton } from '../../shared/components/atoms/hamburger-button/hamburger-button';
import { PrimaryButtonComponent } from '../../shared/components/atoms/buttons/primary-button.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar-layout',
  standalone: true,
  imports: [HamburgerButton, PrimaryButtonComponent],
  templateUrl: './navbar-layout.html',
  styleUrl: './navbar-layout.css'
})
export class NavbarLayout {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  private authService = inject(AuthService);
  private router = inject(Router);

  @Output() menuToggle = new EventEmitter<void>();

  isNavbarVisible = signal(true);
  private lastScrollTop = 0;
  private scrollThreshold = 10;

  readonly currentUser = this.authService.currentUser;
  readonly currentRouter = computed(() => this.router.url);

  @HostListener('window:scroll')
  onWindowScroll() {
    if (!this.isBrowser) return;

    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

    if (currentScroll <= 0) {
      this.isNavbarVisible.set(true);
      return;
    }

    if (Math.abs(currentScroll - this.lastScrollTop) < this.scrollThreshold) return;

    this.isNavbarVisible.set(currentScroll < this.lastScrollTop);
    this.lastScrollTop = currentScroll;
  }

  onMenuClick() {
    this.menuToggle.emit();
  }

  onLogingClick() {
    this.router.navigate(['/login']);
  }

  logout() {
    this.authService.logout();
  }
}
