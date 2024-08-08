import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as AuthActions from './auth.actions';
import { AuthService } from '@app/core/services/auth.service';
import { from, switchMap } from 'rxjs';
import { mapResponse } from '@ngrx/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from '@app/core/services/user.service';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private userService: UserService,
  ) {}

  /**
   * Login effect
   */
  public login$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap(() =>
        from(this.authService.onGoogleSignIn()).pipe(
          mapResponse({
            next: () => AuthActions.loginSuccess(),
            error: (error: HttpErrorResponse) =>
              AuthActions.loginFailure({ error }),
          }),
        ),
      ),
    );
  });

  /**
   * Logout effect
   */
  public logout$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.logout),
      switchMap(() =>
        from(this.authService.onSignOut()).pipe(
          mapResponse({
            next: () => AuthActions.logoutSuccess(),
            error: (error: HttpErrorResponse) =>
              AuthActions.logoutFailure({ error }),
          }),
        ),
      ),
    );
  });

  /**
   * Get user profile effect
   */
  public getUserProfile$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.getUserProfile),
      switchMap(() =>
        from(this.userService.getUserProfile()).pipe(
          mapResponse({
            next: (user) => AuthActions.getUserProfileSuccess({ user }),
            error: (error: HttpErrorResponse) =>
              AuthActions.getUserProfileFailure({ error }),
          }),
        ),
      ),
    );
  });
}
