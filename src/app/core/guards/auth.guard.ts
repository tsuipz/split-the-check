import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const isLoggedIn = await authService.onIsLoggedIn();

  if (isLoggedIn) {
    return true;
  } else {
    router.navigate(['auth', 'login']);
    return false;
  }
};
