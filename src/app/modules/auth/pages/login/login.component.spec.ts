import { ComponentFixture, TestBed } from '@angular/core/testing';
import { screen } from '@testing-library/angular';
import { LoginComponent } from './login.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AuthActions } from '@app/core/stores/auth';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let storeMock: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [provideMockStore()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    storeMock = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    // Assert
    expect(component).toBeTruthy();
  });

  it('should render the login form', async () => {
    // Arrange
    const button = screen.getByRole('button', { name: 'Sign in with Google' });

    // Assert
    expect(button).toBeTruthy();
  });

  describe('signInWithGoogle', () => {
    it('should call onGoogleSignIn method from AuthService', () => {
      // Arrange
      const dispatchSpy = jest.spyOn(storeMock, 'dispatch');

      // Act
      component.signInWithGoogle();

      // Assert
      expect(dispatchSpy).toHaveBeenCalledWith(AuthActions.login());
    });
  });
});
