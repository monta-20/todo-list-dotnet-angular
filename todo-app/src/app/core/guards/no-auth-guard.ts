import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/Auth/auth-service';
import { inject } from '@angular/core';

export const noAuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.getToken();

  if (token) {
    // Si déjà connecté, rediriger vers la page principale
    return router.createUrlTree(['/todo']);
  } else {
    // Pas connecté, accès autorisé
    return true;
  }
};
