import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { Auth, UserCredential } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AuthService', () => {
  let service: AuthService;
  let afAuthMock: jasmine.SpyObj<Auth>;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(() => {
    afAuthMock = jasmine.createSpyObj(
      'Auth',
      [
        'signInWithPopup',
        'signOut',
        'authStateReady',
        'currentUser',
        'setPersistence',
      ],
      {
        authStateReady: jasmine.createSpy().and.resolveTo(),
        currentUser: {
          uid: '123',
        },
        setPersistence: jasmine.createSpy().and.resolveTo(),
      },
    );

    routerMock = jasmine.createSpyObj('Router', ['navigate'], {
      navigate: jasmine.createSpy().and.callThrough(),
    });

    TestBed.configureTestingModule({
      providers: [
        { provide: Auth, useValue: afAuthMock },
        {
          provide: Router,
          useValue: routerMock,
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    // Assert
    expect(service).toBeTruthy();
  });

  describe('onGoogleSignIn', () => {
    it('should sign in with Google and navigate to home page', async () => {
      // Arrange
      spyOn(service, 'onProviderSignIn').and.resolveTo({} as UserCredential);
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
      afAuthMock.signOut.and.rejectWith('Error');

      // Act
      await service.onSignOut();

      // Assert
      expect(afAuthMock.signOut).toHaveBeenCalled();
      expect(routerMock.navigate).not.toHaveBeenCalled();
    });
  });

  describe('onIsLoggedIn', () => {
    it('should return true if the user is logged in', async () => {
      // Act
      const result = await service.onIsLoggedIn();

      // Assert
      expect(result).toBeTrue();
    });
  });
});
