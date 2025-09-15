import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/Auth/auth-service';
import { firstValueFrom } from 'rxjs';

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.getToken();

  if (!token) {
    return router.createUrlTree(['/todo/login']);
  }

  try {
    const user = await firstValueFrom(authService.getCurrentUser());

    const requiredRole = route.data['role'];
    if (requiredRole && user.role !== requiredRole) {
      return router.createUrlTree(['/todo']); // accès refusé
    }

    return true; // autorisé
  } catch (error) {
    // si erreur lors de la récupération de l'utilisateur
    return router.createUrlTree(['/todo/login']);
  }
};


