import { TestBed } from '@angular/core/testing';
import { AuthEffects } from './auth.effects';
import { Actions } from '@ngrx/effects';
import { AuthService } from '@app/core/services/auth.service';
import { UserService } from '@app/core/services/user.service';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import * as AuthActions from './auth.actions';
import { cold, hot } from 'jest-marbles';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from '@app/core/models/interfaces';

describe('AuthEffects', () => {
  let actions$: Actions;
  let authServiceMock: jest.Mocked<AuthService>;
  let userServiceMock: jest.Mocked<UserService>;
  let effects: AuthEffects;

  beforeEach(() => {
    // mock services
    authServiceMock = {
      onGoogleSignIn: jest.fn(),
      onSignOut: jest.fn(),
    } as unknown as jest.Mocked<AuthService>;

    userServiceMock = {
      getUserProfile: jest.fn(),
    } as unknown as jest.Mocked<UserService>;

    TestBed.configureTestingModule({
      providers: [
        AuthEffects,
        provideMockActions(() => actions$),
        {
          provide: AuthService,
          useValue: authServiceMock,
        },
        {
          provide: UserService,
          useValue: userServiceMock,
        },
      ],
    });

    effects = TestBed.inject(AuthEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  describe('login$ ', () => {
    let action: Action;

    beforeEach(() => {
      action = AuthActions.login();
    });

    it('should login successfully', () => {
      // Arrange
      const success = AuthActions.loginSuccess();

      // Act
      actions$ = hot('-a--', { a: action });
      const response = cold('--a|', { a: undefined });
      const expected = cold('---b', { b: success });
      authServiceMock.onGoogleSignIn.mockReturnValue(response as any);

      // Assert
      expect(effects.login$).toBeObservable(expected);
    });

    it('should fail to login', () => {
      // Arrange
      const error = new HttpErrorResponse({
        status: 500,
        statusText: 'Internal Server Error',
      });
      const failure = AuthActions.loginFailure({ error });

      // Act
      actions$ = hot('-a--', { a: action });
      const response = cold('--#|', {}, error);
      const expected = cold('---b', { b: failure });
      authServiceMock.onGoogleSignIn.mockReturnValue(response as any);

      // Assert
      expect(effects.login$).toBeObservable(expected);
    });
  });

  describe('logout$', () => {
    let action: Action;

    beforeEach(() => {
      action = AuthActions.logout();
    });

    it('should logout successfully', () => {
      // Arrange
      const success = AuthActions.logoutSuccess();

      // Act
      actions$ = hot('-a--', { a: action });
      const response = cold('--a|', { a: undefined });
      const expected = cold('---b', { b: success });
      authServiceMock.onSignOut.mockReturnValue(response as any);

      // Assert
      expect(effects.logout$).toBeObservable(expected);
    });

    it('should fail to logout', () => {
      // Arrange
      const error = new HttpErrorResponse({
        status: 500,
        statusText: 'Internal Server Error',
      });
      const failure = AuthActions.logoutFailure({ error });

      // Act
      actions$ = hot('-a--', { a: action });
      const response = cold('--#|', {}, error);
      const expected = cold('---b', { b: failure });
      authServiceMock.onSignOut.mockReturnValue(response as any);

      // Assert
      expect(effects.logout$).toBeObservable(expected);
    });
  });

  describe('getUserProfile$', () => {
    let action: Action;

    beforeEach(() => {
      action = AuthActions.getUserProfile();
    });

    it('should get user profile successfully', () => {
      // Arrange
      const user: User = {
        id: '123',
        email: '',
        name: '',
        groupIds: [],
        settledDebts: {},
      };
      const success = AuthActions.getUserProfileSuccess({ user });

      // Act
      actions$ = hot('-a--', { a: action });
      const response = cold('--a|', { a: user });
      const expected = cold('---b', { b: success });
      userServiceMock.getUserProfile.mockReturnValue(response as any);

      // Assert
      expect(effects.getUserProfile$).toBeObservable(expected);
    });

    it('should fail to get user profile', () => {
      // Arrange
      const error = new HttpErrorResponse({
        status: 500,
        statusText: 'Internal Server Error',
      });
      const failure = AuthActions.getUserProfileFailure({ error });

      // Act
      actions$ = hot('-a--', { a: action });
      const response = cold('--#|', {}, error);
      const expected = cold('---b', { b: failure });
      userServiceMock.getUserProfile.mockReturnValue(response as any);

      // Assert
      expect(effects.getUserProfile$).toBeObservable(expected);
    });
  });
});
