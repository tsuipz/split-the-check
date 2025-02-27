import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidebarComponent } from './sidebar.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { fireEvent, screen } from '@testing-library/angular';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;
  let el: DebugElement;
  let storeMock: MockStore;
  let routerMock: jest.Mocked<Router>;

  beforeEach(async () => {
    routerMock = {
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    await TestBed.configureTestingModule({
      imports: [SidebarComponent],
      providers: [
        provideMockStore(),
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    el = fixture.debugElement;
    storeMock = TestBed.inject(MockStore);
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
      const dispatchSpy = jest.spyOn(storeMock, 'dispatch');
      const logoutEl = screen.getByText('Logout');

      // Act
      fireEvent.click(logoutEl);

      // Assert
      expect(dispatchSpy).toHaveBeenCalled();
    });
  });

  describe('onLogout', () => {
    it('should call the onSignOut method', () => {
      // Arrange
      const dispatchSpy = jest.spyOn(storeMock, 'dispatch');
      // Act
      component.onLogout();

      // Assert
      expect(dispatchSpy).toHaveBeenCalled();
    });
  });
});
