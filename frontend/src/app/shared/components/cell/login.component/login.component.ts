import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID, inject, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { environment } from '../../../../../enviroments/enviroment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private fb = inject(FormBuilder);

  readonly googleClientId = environment.googleClientId;
  readonly errorMessage = signal('');
  readonly isLoading = signal(false);

  loginForm: FormGroup;
  private isBrowser: boolean;

  constructor() {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
    if (this.isBrowser) {
      window.handleCredentialResponse = (response: any) => {
        this.handleGoogleResponse(response);
      };

      // Inicializar Google Sign-In después de que el script se cargue
      this.initializeGoogleSignIn();
    }
  }

  private initializeGoogleSignIn() {
    // Esperar a que el script de Google se cargue
    const checkGoogleLoaded = setInterval(() => {
      if (window.google && window.google.accounts) {
        clearInterval(checkGoogleLoaded);
        this.renderGoogleButton();
      }
    }, 100);

    // Timeout después de 10 segundos
    setTimeout(() => {
      clearInterval(checkGoogleLoaded);
    }, 10000);
  }

  private renderGoogleButton() {
    if (!this.isBrowser) return;

    const buttonElement = document.getElementById('googleSignInButton');
    if (!buttonElement) {
      console.error('Google Sign-In button element not found');
      return;
    }

    try {
      window.google?.accounts?.id?.initialize({
        client_id: this.googleClientId,
        callback: (response: any) => this.handleGoogleResponse(response),
        auto_select: false,
      });

      window.google?.accounts?.id?.renderButton(
        buttonElement,
        {
          theme: 'outline',
          size: 'large',
          text: 'signin_with',
          shape: 'rectangular',
          logo_alignment: 'left',
        }
      );
    } catch (error) {
      console.error('Error initializing Google Sign-In:', error);
    }
  }

  private handleGoogleResponse(response: any) {
    const idToken = response.credential;
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.authService.authenticateWithGoogle(idToken).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set(
          error.error?.detail || 'Error al autenticar. Verifica que uses un correo @utma.edu.mx'
        );
        console.error('Google auth error:', error);
      }
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.errorMessage.set('Por favor completa todos los campos correctamente');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set(
          error.error?.detail || 'Error al iniciar sesión. Verifica tus credenciales'
        );
        console.error('Login error:', error);
      }
    });
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }

  ngOnDestroy() {
    if (this.isBrowser && window.handleCredentialResponse) {
      delete window.handleCredentialResponse;
    }
  }
}
