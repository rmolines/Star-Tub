import { getApp, getApps, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

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

export { app, db };
