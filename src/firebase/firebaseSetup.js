// Initialize Firebase
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import config from './firebase-config-dev';

// TODO: look at https://github.com/Phoqe/react-material-ui-firebase for inspiration on how to use firebase seemlessly
try {
  firebase.initializeApp(config);
} catch (err) {
  // taken from https://github.com/now-examples/next-news/blob/master/lib/db.js
  if (!/already exists/.test(err.message)) {
    console.error('Firebase initialization error', err.stack);
  }
}

const firestoreSettings = {};
const db = firebase.firestore();
db.settings(firestoreSettings);
const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: 'popup',
  signInOptions: [
    // Leave the lines as is for the providers you want to offer your users.
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.FacebookAuthProvider.PROVIDER_ID,
  ],
  // tosUrl and privacyPolicyUrl accept either url string or a callback
  // function.
  // Terms of service url/callback.
  // TODO: Add ToS and Privacy links
  // tosUrl: '',
  // Privacy policy url/callback.
  // privacyPolicyUrl: '',
  callbacks: {
    // Avoid redirects after sign-in.
    signInSuccessWithAuthResult: () => false,
  },
};

export { StyledFirebaseAuth, uiConfig, db };
export default firebase;
