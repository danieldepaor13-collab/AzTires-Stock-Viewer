import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDxk04M1L54O1xT1QWkP15Uwrj4pq6ghp4",
  authDomain: "tires-f729a.firebaseapp.com",
  projectId: "tires-f729a",
  storageBucket: "tires-f729a.firebasestorage.app",
  messagingSenderId: "379737758469",
  appId: "1:379737758469:web:9bdbd9e0265dc2266f356c"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

