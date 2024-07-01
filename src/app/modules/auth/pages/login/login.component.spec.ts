import { ComponentFixture, TestBed } from '@angular/core/testing';
import { screen } from '@testing-library/angular';
import { LoginComponent } from './login.component';
import { AuthService } from '@core/services/auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceMock: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authServiceMock = jasmine.createSpyObj('AuthService', ['onGoogleSignIn']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [{ provide: AuthService, useValue: authServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
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
      // Act
      component.signInWithGoogle();

      // Assert
      expect(authServiceMock.onGoogleSignIn).toHaveBeenCalled();
    });
  });
});
