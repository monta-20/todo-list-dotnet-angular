import { Component, NgZone, AfterViewInit } from '@angular/core';
import { AuthRequest, AuthResponse } from '../../models/Auth';
import { AuthService } from '../../core/services/Auth/auth-service';
import { Router } from '@angular/router';
import { GoogleAuthService } from '../../core/services/GoogleAuthService/google-auth.service';
import { ToastService } from '../../core/services/Toast/toast.service';

@Component({
  selector: 'app-sign-in',
  standalone: false,
  templateUrl: './sign-in.html',
  styleUrls: ['./sign-in.css']
})
export class SignIn implements AfterViewInit {
  email = '';
  password = '';
  user?: AuthResponse;

  constructor(
    private authService: AuthService,
    private googleAuth: GoogleAuthService,
    private toast: ToastService,
    private router: Router,
    private ngZone: NgZone
  ) { }
  // Connexion classique avec email/password
  onSignIn() {
    const request: AuthRequest = { email: this.email, password: this.password };

    this.authService.signIn(request).subscribe({
      next: (res) => {
        this.authService.setToken(res.token!);
        this.user = res;

        // Toast de succès
        this.toast.show(
          `Bienvenue ${res.name} ! Ravi de vous revoir.`,
          'success',
          3000
        );

        // Redirection après 3s
        setTimeout(() => {
          this.router.navigate(['/todo']);
        }, 3000);
      },
      error: (err) =>
        this.toast.show(
          `${err.error?.message || 'Impossible de se connecter. Vérifiez vos identifiants.'}`,
          'error',
          3000
        )
    });
  }

  // Google Sign-In
  ngAfterViewInit(): void {
    this.googleAuth.initGoogleButton(
      (res: AuthResponse) => {
        this.ngZone.run(() => {
          this.authService.setToken(res.token!);
          this.user = res;

          this.toast.show(
            `Connexion réussie via Google. Bienvenue ${res.name} !`,
            'success',
            3000
          );

          setTimeout(() => {
            this.router.navigate(['/todo']);
          }, 3000);
        });
      },
      (err) => {
        this.ngZone.run(() => {
          this.toast.show(
            `Une erreur est survenue avec Google Sign-In. Veuillez réessayer.`,
            'error',
            3000
          );
        });
      }
    );
  }

  // Déconnexion
  logout() {
    this.authService.clearToken();
    this.user = undefined;

    this.toast.show(
      'Vous êtes maintenant déconnecté. À bientôt !',
      'info'
    );
  }

  // Redirection vers SignUp
  goToSignUp() {
    this.toast.show(
      'Créons un compte ensemble !',
      'info',
      2000
    );
    this.router.navigate(['/todo/signup']);
  }

}
