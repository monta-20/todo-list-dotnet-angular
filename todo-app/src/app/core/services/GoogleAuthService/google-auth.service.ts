import { Injectable } from '@angular/core';
import { AuthService } from '../Auth/auth-service';
import { AuthResponse, AuthRequest } from '../../../models/Auth';
import { environment } from '../../../../../environments/environment';
declare const google: any;
@Injectable({
  providedIn: 'root'
})
export class GoogleAuthService {
  private clientId = environment.googleClientId;
  constructor(private authService: AuthService) { }

  initGoogleButton(callback: (res: AuthResponse) => void, errorCallback?: (err: any) => void) {
    // Initialiser Google Sign-In
    google.accounts.id.initialize({
      client_id: this.clientId,
      callback: (response: any) => this.handleGoogleResponse(response, callback, errorCallback)
    });

    // Afficher le bouton Google Sign-In
    const btn = document.getElementById('google-signin-button');
    if (btn) {
      google.accounts.id.renderButton(btn, {
        theme: 'outline',
        size: 'large',
        width: '250'
      });
    }
  }

  private handleGoogleResponse(response: any, callback: (res: AuthResponse) => void, errorCallback?: (err: any) => void) {
    try {
      // Décoder le token pour récupérer email et name
      const payload: any = JSON.parse(atob(response.credential.split('.')[1]));

      const request: AuthRequest = {
        email: payload.email,
        name: payload.name,
        googleToken: response.credential
      };

      this.authService.googleLogin(request).subscribe({
        next: (res) => {
          this.authService.setToken(res.token!);
          callback(res);
        },
        error: (err) => {
          if (errorCallback) errorCallback(err);
          else alert(err.error?.message || 'Erreur Google Login');
        }
      });
    } catch (error) {
      console.error('Erreur lors du décodage du token Google:', error);
      alert('Impossible de récupérer les informations Google.');
    }
  }
}
