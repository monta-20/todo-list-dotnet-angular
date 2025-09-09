import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/Auth/auth-service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.getToken();

  if (token) {
    // L'utilisateur est connecté, autoriser l'accès
    return true;
  } else {
    // Non connecté, rediriger vers login
    return router.createUrlTree(['/todo/login']);
  }
};

