import { Injectable } from '@angular/core';
import { Auth, signInWithPopup, GoogleAuthProvider } from '@angular/fire/auth';
// import firebase from 'firebase/compat/app';
// import 'firebase/compat/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private afAuth: Auth) {}

  async googleSignIn() {
    const provider = new GoogleAuthProvider();
    try {
      // const credential = await this.afAuth.signInWithPopup(provider);
      const credential = await signInWithPopup(this.afAuth, provider);
      // eslint-disable-next-line no-console
      console.log('Google sign in successful', credential);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error during Google sign in', error);
    }
  }

  async signOut() {
    try {
      await this.afAuth.signOut();
      // eslint-disable-next-line no-console
      console.log('Sign out successful');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error during sign out', error);
    }
  }
}
