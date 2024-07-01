import { Injectable } from '@angular/core';
import {
  Auth,
  signInWithPopup,
  GoogleAuthProvider,
  UserCredential,
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { browserSessionPersistence } from 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private afAuth: Auth, private router: Router) {}

  /**
   * Sign in with Google
   */
  public async onGoogleSignIn(): Promise<void> {
    const provider = new GoogleAuthProvider();

    try {
      // Set session persistence to be able to sign out
      await this.afAuth.setPersistence(browserSessionPersistence);

      // Sign in with Google
      await this.onProviderSignIn(provider);

      // Navigate to home page
      this.router.navigate(['/home']);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error during Google sign in', error);
    }
  }

  /**
   * Sign in with provider
   * @param provider - GoogleAuthProvider
   * @returns - UserCredential
   */
  public async onProviderSignIn(
    provider: GoogleAuthProvider,
  ): Promise<UserCredential> {
    return await signInWithPopup(this.afAuth, provider);
  }

  /**
   * Sign out
   */
  public async onSignOut(): Promise<void> {
    try {
      // Sign out
      await this.afAuth.signOut();

      // Navigate to login page
      this.router.navigate(['/auth/login']);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error during sign out', error);
    }
  }

  /**
   * Check if the user is logged in
   * @returns true if the user is logged in, false otherwise
   */
  public async onIsLoggedIn(): Promise<boolean> {
    // Wait for the auth state to be ready
    await this.afAuth.authStateReady();

    // Check if the user exists or not
    return !!this.afAuth.currentUser;
  }
}
