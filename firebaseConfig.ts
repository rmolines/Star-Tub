import { getApp, getApps, initializeApp } from 'firebase/app';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import { connectStorageEmulator, getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyC9leLmboRDlay_PCgCW8DNrZJGIiHE8PQ',
  authDomain: 'star-tub.firebaseapp.com',
  projectId: 'star-tub',
  storageBucket: 'star-tub.appspot.com',
  messagingSenderId: '117519604603',
  appId: '1:117519604603:web:b8a51ce73add8558cdbbde',
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const storage = getStorage();

connectFirestoreEmulator(db, '0.0.0.0', 8080);
connectStorageEmulator(storage, '0.0.0.0', 9199);

export { app, db };
