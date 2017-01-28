import { AngularFireModule, AuthProviders, AuthMethods } from 'angularfire2';
export const firebaseConfig = {
  apiKey: "AIzaSyA6VvwaSDcA_JLF-9YW7_9tgSgm2s9vbjE",
  authDomain: "chat-and-image-sharing.firebaseapp.com",
  databaseURL: "https://chat-and-image-sharing.firebaseio.com",
  storageBucket: "chat-and-image-sharing.appspot.com",
};
export const myFirebaseAuthConfig = {
  provider: AuthProviders.Password,
  method: AuthMethods.Password
};
