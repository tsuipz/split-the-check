import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { Auth, UserCredential } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AuthService', () => {
  let service: AuthService;
  let afAuthMock: jest.Mocked<Auth>;
  let routerMock: jest.Mocked<Router>;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    afAuthMock = {
      signInWithPopup: jest.fn(),
      signOut: jest.fn(),
      authStateReady: jest.fn().mockResolvedValue(undefined),
      currentUser: {
        uid: '123',
      },
      setPersistence: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<Auth>;

    routerMock = {
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    TestBed.configureTestingModule({
      providers: [
        { provide: Auth, useValue: afAuthMock },
        { provide: Router, useValue: routerMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    service = TestBed.inject(AuthService);
  });

  afterEach(() => {
    if (consoleErrorSpy) {
      consoleErrorSpy.mockRestore();
    }
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('onGoogleSignIn', () => {
    it('should sign in with Google and navigate to home page', async () => {
      // Arrange
      jest
        .spyOn(service, 'onProviderSignIn')
        .mockResolvedValue({} as UserCredential);

      // Act
      await service.onGoogleSignIn();

      // Assert
      expect(afAuthMock.setPersistence).toHaveBeenCalled();
    });
  });

  describe('onSignOut', () => {
    it('should sign out the user and navigate to login page', async () => {
      // Act
      await service.onSignOut();

      // Assert
      expect(afAuthMock.signOut).toHaveBeenCalled();
      expect(routerMock.navigate).toHaveBeenCalledWith(['/auth/login']);
    });

    it('should log an error if sign out fails', async () => {
      // Arrange
      consoleErrorSpy = jest.spyOn(console, 'error').mockReturnValue();
      afAuthMock.signOut.mockRejectedValue('Error');

      // Act
      await service.onSignOut();

      // Assert
      expect(afAuthMock.signOut).toHaveBeenCalled();
      expect(routerMock.navigate).not.toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe('onIsLoggedIn', () => {
    it('should return true if the user is logged in', async () => {
      // Act
      const result = await service.onIsLoggedIn();

      // Assert
      expect(result).toBe(true);
    });
  });
});
