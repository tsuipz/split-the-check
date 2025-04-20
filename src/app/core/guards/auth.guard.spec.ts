import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { authGuard } from './auth.guard';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AuthActions, AuthSelectors } from '../stores/auth';

const helperAuthGuard = () =>
  TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));

describe('authGuard', () => {
  let authServiceMock: jest.Mocked<AuthService>;
  let routerMock: jest.Mocked<Router>;
  let storeMock: MockStore;

  beforeEach(() => {
    authServiceMock = {
      onIsLoggedIn: jest.fn(),
    } as unknown as jest.Mocked<AuthService>;

    routerMock = {
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    TestBed.configureTestingModule({
      providers: [
        provideMockStore(),
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });

    storeMock = TestBed.inject(MockStore);
    storeMock.overrideSelector(AuthSelectors.selectCurrentUserId, '123');
  });

  it('should allow navigation if the user is logged in', async () => {
    // Arrange
    const dispatchSpy = jest.spyOn(storeMock, 'dispatch');
    authServiceMock.onIsLoggedIn.mockResolvedValue(true);

    // Act
    const result = await helperAuthGuard();

    // Assert
    expect(result).toBe(true);
    expect(routerMock.navigate).not.toHaveBeenCalled();
    expect(dispatchSpy).toHaveBeenCalledWith(AuthActions.getUserProfile());
  });

  it('should redirect to login if the user is not logged in', async () => {
    // Arrange
    const dispatchSpy = jest.spyOn(storeMock, 'dispatch');
    authServiceMock.onIsLoggedIn.mockResolvedValue(false);

    // Act
    const result = await helperAuthGuard();

    // Assert
    expect(result).toBe(false);
    expect(routerMock.navigate).toHaveBeenCalledWith(['auth', 'login']);
    expect(dispatchSpy).not.toHaveBeenCalledWith(AuthActions.getUserProfile());
  });
});
