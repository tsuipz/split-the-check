import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarComponent } from './sidebar.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { AuthService } from '@app/core/services/auth.service';
import { Router } from '@angular/router';
import { fireEvent, screen } from '@testing-library/angular';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;
  let el: DebugElement;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authServiceMock = jasmine.createSpyObj('AuthService', ['onSignOut']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [SidebarComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    el = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('UI', () => {
    it('should render all the links', () => {
      // Arrange
      const listItems = el.queryAll(By.css('mat-list-item'));

      // Assert
      expect(listItems.length).toBe(6);
    });

    it('should render the top links', () => {
      // Arrange
      const topLinks = el.query(By.css('#routes__top'));
      const listItems = topLinks.queryAll(By.css('mat-list-item'));
      const titles = listItems.map(
        (item) => item.query(By.css('span')).nativeElement.textContent,
      );

      // Assert
      expect(titles).toEqual(['Home', 'Friends', 'Groups', 'Activity']);
    });

    it('should render the bottom links', () => {
      // Arrange
      const bottomLinks = el.query(By.css('#routes__bottom'));
      const listItems = bottomLinks.queryAll(By.css('mat-list-item'));
      const titles = listItems.map(
        (item) => item.query(By.css('span')).nativeElement.textContent,
      );

      // Assert
      expect(titles).toEqual(['Settings', 'Logout']);
    });

    it('should call the onNavigateToHome method when the Home link is clicked', () => {
      // Arrange
      const homeEl = screen.getByText('Home');

      // Act
      fireEvent.click(homeEl);

      // Assert
      expect(routerMock.navigate).toHaveBeenCalledWith(['home']);
    });

    it('should call the onNavigateToFriends method when the Friends link is clicked', () => {
      // Arrange
      const friendsEl = screen.getByText('Friends');

      // Act
      fireEvent.click(friendsEl);

      // Assert
      expect(routerMock.navigate).toHaveBeenCalledWith(['friends']);
    });

    it('should call the onNavigateToGroups method when the Groups link is clicked', () => {
      // Arrange
      const groupsEl = screen.getByText('Groups');

      // Act
      fireEvent.click(groupsEl);

      // Assert
      expect(routerMock.navigate).toHaveBeenCalledWith(['groups']);
    });

    it('should call the logout method when the Logout link is clicked', () => {
      // Arrange
      const logoutEl = screen.getByText('Logout');

      // Act
      fireEvent.click(logoutEl);

      // Assert
      expect(authServiceMock.onSignOut).toHaveBeenCalled();
    });
  });

  describe('onLogout', () => {
    it('should call the onSignOut method', async () => {
      // Act
      await component.onLogout();

      // Assert
      expect(authServiceMock.onSignOut).toHaveBeenCalled();
    });
  });
});
