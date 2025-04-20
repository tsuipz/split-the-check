import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Store } from '@ngrx/store';
import { AuthActions, AuthSelectors } from '../stores/auth';
import { firstValueFrom } from 'rxjs';
import { filter, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const store = inject(Store);
  const isLoggedIn = await authService.onIsLoggedIn();

  if (isLoggedIn) {
    store.dispatch(AuthActions.getUserProfile());
    // Wait for the current user ID to be available
    await firstValueFrom(
      store.select(AuthSelectors.selectCurrentUserId).pipe(
        filter((userId) => userId !== null),
        take(1),
      ),
    );
    return true;
  } else {
    router.navigate(['auth', 'login']);
    return false;
  }
};
