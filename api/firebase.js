import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import config from './config';

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

const auth = firebase.auth();
const db = firebase.firestore();

/**
 * Add a function to return error messages given an error message
 * for authentication
 */
auth.handleError = function handleError(errorCode) {
  switch (errorCode) {
    case 'auth/wrong-password':
      return 'Wrong password.';
    case 'auth/invalid-email':
      return 'Email not valid.';
    case 'auth/user-not-found':
      return 'No user exists with this email address.';
    case 'auth/email-already-in-use':
      return 'Email is already being used by another account.';
    case 'auth/weak-password':
      return 'Weak password.';
    default:
      return '';
  }
};

export default firebase;
export { auth, db };
