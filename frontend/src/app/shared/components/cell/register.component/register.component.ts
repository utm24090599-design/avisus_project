import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID, inject, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { environment } from '../../../../../enviroments/enviroment';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private fb = inject(FormBuilder);

  readonly googleClientId = environment.googleClientId;
  readonly errorMessage = signal('');
  readonly isLoading = signal(false);

  registerForm: FormGroup;
  private isBrowser: boolean;

  constructor() {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  private passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
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
          text: 'signup_with',
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
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set(
          error.error?.detail || 'Error al autenticar. Verifica que uses un correo institucional (.edu)'
        );
        console.error('Google auth error:', error);
      }
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.errorMessage.set('Por favor completa todos los campos correctamente');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    const { email, name, password } = this.registerForm.value;

    this.authService.register(email, name, '', password).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set(
          error.error?.detail || 'Error al registrarse. Solo se permiten correos institucionales (.edu)'
        );
        console.error('Register error:', error);
      }
    });
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  ngOnDestroy() {
    if (this.isBrowser && window.handleCredentialResponse) {
      delete window.handleCredentialResponse;
    }
  }
}
