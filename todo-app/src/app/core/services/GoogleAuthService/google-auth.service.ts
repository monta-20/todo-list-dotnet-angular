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
          callback(res);
        },
        error: (err) => {
          if (errorCallback) errorCallback(err);
        }
      });
    } catch (error) {
        // handle error
    }
  }
}
