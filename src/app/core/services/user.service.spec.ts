import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '@env';
import { of, Subscription } from 'rxjs';

describe('UserService', () => {
  let service: UserService;
  let afAuthMock: jasmine.SpyObj<Auth>;
  let subscription: Subscription;

  beforeEach(() => {
    afAuthMock = jasmine.createSpyObj('Auth', ['currentUser'], {
      currentUser: {
        uid: '123',
      },
    });

    TestBed.configureTestingModule({
      providers: [
        UserService,
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        provideFirestore(() => getFirestore()),
        {
          provide: Auth,
          useValue: afAuthMock,
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(UserService);
  });

  afterEach(() => {
    if (subscription) {
      subscription.unsubscribe();
    }
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createUserProfile', () => {
    it('should return a new empty user profile', () => {
      // Arrange
      const afUser = null;

      // Act
      const result$ = service.createUserProfile(afUser);

      // Assert
      subscription = result$.subscribe((result) => {
        expect(result).toEqual({
          id: '',
          name: '',
          email: '',
          groupIds: [],
          settledDebts: {},
        });
      });
    });
  });

  describe('getUserProfile', () => {
    it('should return the user profile', () => {
      // Arrange
      spyOn(service, 'createUserProfile').and.returnValue(
        of({
          id: '',
          name: '',
          email: '',
          groupIds: [],
          settledDebts: {},
        } as any),
      );

      // Act
      const result$ = service.getUserProfile();

      // Assert
      subscription = result$.subscribe((result) => {
        expect(result).toEqual({
          id: '',
          name: '',
          email: '',
          groupIds: [],
          settledDebts: {},
        });
        expect(service.createUserProfile).toHaveBeenCalledWith(
          afAuthMock.currentUser,
        );
      });
    });
  });
});
