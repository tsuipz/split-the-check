import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { authGuard } from './auth.guard';

const helperAuthGuard = () =>
  TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));

describe('authGuard', () => {
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authServiceMock = jasmine.createSpyObj('AuthService', ['onIsLoggedIn']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });

    authServiceMock = TestBed.inject(
      AuthService,
    ) as jasmine.SpyObj<AuthService>;
    routerMock = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should allow navigation if the user is logged in', async () => {
    // Arrange
    authServiceMock.onIsLoggedIn.and.returnValue(Promise.resolve(true));

    // Act
    const result = await helperAuthGuard();

    // Assert
    expect(result).toBeTrue();
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('should redirect to login if the user is not logged in', async () => {
    // Arrange
    authServiceMock.onIsLoggedIn.and.returnValue(Promise.resolve(false));

    // Act
    const result = await helperAuthGuard();

    // Assert
    expect(result).toBeFalse();
    expect(routerMock.navigate).toHaveBeenCalledWith(['auth', 'login']);
  });
});
