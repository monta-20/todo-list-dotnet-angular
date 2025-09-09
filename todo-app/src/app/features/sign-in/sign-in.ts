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

  ngAfterViewInit(): void {
    // Initialisation du bouton Google
    this.googleAuth.initGoogleButton(
      (res: AuthResponse) => {
        this.ngZone.run(() => {
          this.authService.setToken(res.token!);
          this.user = res;

          // Affiche le toast pour 3 secondes
          this.toast.show(`Bienvenue ${res.name}`, 'success', 3000);

          // Navigue après 3 secondes
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


  // Connexion classique avec email/password
  onSignIn() {
    const request: AuthRequest = { email: this.email, password: this.password };

    this.authService.signIn(request).subscribe({
      next: (res) => {
        this.authService.setToken(res.token!);
        this.user = res;

        // Affiche le toast
        this.toast.show(`Bienvenue ${res.name}`, 'success', 3000);

        // Navigue après 3 secondes
        setTimeout(() => {
          this.router.navigate(['/todo']);
        }, 3000);
      },
      error: (err) =>
        this.toast.show(err.error?.message || 'Erreur lors de la connexion', 'error', 3000)
    });
  }


  // Déconnexion
  logout() {
    this.authService.clearToken();
    this.user = undefined;
    this.toast.show('Déconnexion réussie', 'info');
  }

  // Redirection vers SignUp
  goToSignUp() {
    this.router.navigate(['/todo/signup']);
  }
}
