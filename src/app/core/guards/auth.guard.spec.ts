import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { authGuard } from './auth.guard';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AuthActions } from '../stores/auth';

const helperAuthGuard = () =>
  TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));

describe('authGuard', () => {
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let routerMock: jasmine.SpyObj<Router>;
  let storeMock: MockStore;

  beforeEach(() => {
    authServiceMock = jasmine.createSpyObj('AuthService', ['onIsLoggedIn']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        provideMockStore(),
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });

    authServiceMock = TestBed.inject(
      AuthService,
    ) as jasmine.SpyObj<AuthService>;
    routerMock = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    storeMock = TestBed.inject(MockStore);
  });

  it('should allow navigation if the user is logged in', async () => {
    // Arrange
    const dispatchSpy = spyOn(storeMock, 'dispatch');
    authServiceMock.onIsLoggedIn.and.returnValue(Promise.resolve(true));

    // Act
    const result = await helperAuthGuard();

    // Assert
    expect(result).toBeTrue();
    expect(routerMock.navigate).not.toHaveBeenCalled();
    expect(dispatchSpy).toHaveBeenCalledWith(AuthActions.getUserProfile());
  });

  it('should redirect to login if the user is not logged in', async () => {
    // Arrange
    const dispatchSpy = spyOn(storeMock, 'dispatch');
    authServiceMock.onIsLoggedIn.and.returnValue(Promise.resolve(false));

    // Act
    const result = await helperAuthGuard();

    // Assert
    expect(result).toBeFalse();
    expect(routerMock.navigate).toHaveBeenCalledWith(['auth', 'login']);
    expect(dispatchSpy).not.toHaveBeenCalledWith(AuthActions.getUserProfile());
  });
});
