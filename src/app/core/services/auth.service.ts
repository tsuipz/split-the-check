import { Injectable } from '@angular/core';
import { Auth, signInWithPopup, GoogleAuthProvider } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { setPersistence, browserLocalPersistence } from 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private afAuth: Auth, private router: Router) {}

  public async googleSignIn() {
    const provider = new GoogleAuthProvider();

    try {
      await setPersistence(this.afAuth, browserLocalPersistence);
      const credential = await signInWithPopup(this.afAuth, provider);
      await setPersistence(this.afAuth, browserLocalPersistence);

      this.router.navigate(['/home']);
      // eslint-disable-next-line no-console
      console.log('Google sign in successful', credential);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error during Google sign in', error);
    }
  }

  public async signOut() {
    try {
      await this.afAuth.signOut();
      // eslint-disable-next-line no-console
      console.log('Sign out successful');
      this.router.navigate(['/auth/login']);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error during sign out', error);
    }
  }

  public async isLoggedIn(): Promise<boolean> {
    await this.afAuth.authStateReady();

    return !!this.afAuth.currentUser;
  }
}
