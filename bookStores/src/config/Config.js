import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDVhaYvUsMdkH5kw4UQOTL-0dU8w9JBjyc",
    authDomain: "online-book-store-48393.firebaseapp.com",
    projectId: "online-book-store-48393",
    storageBucket: "online-book-store-48393.appspot.com",
    messagingSenderId: "938396206767",
    appId: "1:938396206767:web:28cb972ed80c3bd67f765a",
    measurementId: "G-WD4YWMZSE2"
};

// Initialize Firebase only if not initialized already
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Firebase services (auth, firestore, storage) using compat API
const auth = firebase.auth();
const fs = firebase.firestore();
const storage = firebase.storage();

export { auth, fs, storage };
