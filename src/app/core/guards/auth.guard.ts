import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Store } from '@ngrx/store';
import { AuthActions } from '../stores/auth';

export const authGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const store = inject(Store);
  const isLoggedIn = await authService.onIsLoggedIn();

  if (isLoggedIn) {
    store.dispatch(AuthActions.getUserProfile());
    return true;
  } else {
    router.navigate(['auth', 'login']);
    return false;
  }
};
