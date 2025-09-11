import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AuthService } from '../services/Auth/auth-service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();
  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // Gérer les erreurs globales
  return next(authReq).pipe(
    catchError((error: any) => {
      if (error.status === 401) {
        alert('Vous devez vous reconnecter');
        authService.clearToken();
        router.navigate(['/todo/login']);
      } else if (error.status === 403) {
        alert('Accès refusé');
      } else if (error.status === 400) {
        alert(error.error?.message || 'Requête invalide');
      } else {
        console.error(error);
        alert('Erreur serveur');
      }
      return throwError(() => error);
    })
  );
};
