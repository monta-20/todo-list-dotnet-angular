import { Injectable } from '@angular/core';
import { AuthService } from '../Auth/auth-service';
import { AuthResponse, AuthRequest } from '../../../models/Auth';
import { environment } from '../../../../../environments/environment';
import { ToastService } from '../Toast/toast.service';
declare const google: any;
@Injectable({
  providedIn: 'root'
})
export class GoogleAuthService {
  private clientId = environment.googleClientId;

  constructor(
    private authService: AuthService,
    private toast: ToastService
  ) { }

  initGoogleButton(
    callback: (res: AuthResponse) => void,
    errorCallback?: (err: any) => void
  ) {
    google.accounts.id.initialize({
      client_id: this.clientId,
      callback: (response: any) =>
        this.handleGoogleResponse(response, callback, errorCallback)
    });

    const btn = document.getElementById('google-signin-button');
    if (btn) {
      google.accounts.id.renderButton(btn, {
        theme: 'outline',
        size: 'large',
        width: '250'
      });
    }
  }

  private handleGoogleResponse(
    response: any,
    callback: (res: AuthResponse) => void,
    errorCallback?: (err: any) => void
  ) {
    try {
      const payload: any = JSON.parse(atob(response.credential.split('.')[1]));

      const request: AuthRequest = {
        email: payload.email,
        name: payload.name,
        googleToken: response.credential
      };

      this.authService.googleLogin(request).subscribe({
        next: (res) => {
          this.authService.setToken(res.token!);
          this.toast.show(`Bienvenue ${res.name}`, 'success', 3000);
          callback(res);
        },
        error: (err) => {
          const msg = err.error?.message || 'Erreur Google Login';
          this.toast.show(msg, 'error', 3000);
          if (errorCallback) errorCallback(err);
        }
      });
    } catch (error) {
      console.error('Erreur lors du décodage du token Google:', error);
      this.toast.show('Impossible de récupérer les informations Google.', 'error', 3000);
    }
  }
}
