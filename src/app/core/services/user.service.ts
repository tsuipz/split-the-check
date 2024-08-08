import { Injectable } from '@angular/core';
import { User as AfUser, Auth } from '@angular/fire/auth';
import {
  collection,
  Firestore,
  doc,
  docData,
  setDoc,
} from '@angular/fire/firestore';
import { map, Observable, of } from 'rxjs';
import { User } from '../models/interfaces';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private usersCollection = collection(this.afStore, 'users');

  constructor(private afStore: Firestore, private afAuth: Auth) {}

  /**
   * Get user profile and create user profile if it does not exist
   * @param afUser - User
   */
  public createUserProfile(afUser: AfUser | null): Observable<User> {
    if (!afUser) {
      const user: User = {
        id: '',
        name: '',
        email: '',
        groupIds: [],
        settledDebts: {},
      };
      return of(user);
    }

    const userDoc = doc(this.usersCollection, afUser.uid);
    const user$: Observable<User> = docData(userDoc);

    return user$.pipe(
      map((user) => {
        if (!user) {
          const userProfile: User = {
            id: afUser.uid,
            name: afUser.displayName || '',
            email: afUser.email || '',
            groupIds: [],
            settledDebts: {},
          };

          // Create user profile
          setDoc(userDoc, userProfile);

          return userProfile;
        }
        return user;
      }),
    );
  }

  /**
   * Get user profile
   * @param userId - string
   * @returns - User
   */
  public getUserProfile(): Observable<User> {
    const currentUser = this.afAuth.currentUser;

    return this.createUserProfile(currentUser);
  }

  /**
   * Get user profile by user id
   * @param userId - string
   * @returns - User
   */
  public getUserProfileById(userId: string): Observable<User> {
    const userDoc = doc(this.usersCollection, userId);
    const user$: Observable<User> = docData(userDoc);

    return user$;
  }
}
