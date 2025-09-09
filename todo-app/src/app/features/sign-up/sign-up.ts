import { Component, NgZone, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/Auth/auth-service';
import { AuthRequest, AuthResponse } from '../../models/Auth';
import { Router } from '@angular/router';
import { GoogleAuthService } from '../../core/services/GoogleAuthService/google-auth.service';
import { ToastService } from '../../core/services/Toast/toast.service';

@Component({
  selector: 'app-sign-up',
  standalone: false,
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css'
})
export class SignUp implements AfterViewInit {
  signUpForm: FormGroup;
  errorMessage: string = '';
  user?: AuthResponse;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private googleAuth: GoogleAuthService,
    private toast: ToastService,
    private router: Router,
    private ngZone: NgZone
  ) {
    this.signUpForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  ngAfterViewInit(): void {
    // Google Sign-In
    this.googleAuth.initGoogleButton(
      (res: AuthResponse) => {
        this.ngZone.run(() => {
          this.authService.setToken(res.token!);
          this.user = res;

          // Toast succès
          this.toast.show(`Bienvenue ${res.name}`, 'success', 3000);

          // Navigation après 3 secondes
          setTimeout(() => {
            this.router.navigate(['/todo']);
          }, 3000);
        });
      },
      (err) => {
        this.ngZone.run(() => {
          this.toast.show('Erreur Google Sign-In', 'error', 3000);
        });
      }
    );
  }

  // Vérifie que les mots de passe correspondent
  passwordMatchValidator(form: FormGroup) {
    return form.get('password')!.value === form.get('confirmPassword')!.value
      ? null : { mismatch: true };
  }

  // Inscription classique
  onSubmit() {
    if (this.signUpForm.invalid) return;

    const request: AuthRequest = {
      name: this.signUpForm.value.name,
      email: this.signUpForm.value.email,
      password: this.signUpForm.value.password
    };

    this.authService.signUp(request).subscribe({
      next: (response) => {
        if (response?.token) {
          this.authService.setToken(response.token);

          // Toast succès inscription
          this.toast.show('Inscription réussie', 'success', 3000);

          // Naviguer vers login après 3 secondes
          setTimeout(() => {
            this.router.navigate(['/todo/login']);
          }, 3000);
        }
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = err.error?.message || 'Une erreur est survenue';
        this.toast.show(this.errorMessage, 'error', 3000);
      }
    });
  }

  // Aller à la page de connexion
  goToSignIn() {
    this.router.navigate(['/todo/login']);
  }
}
