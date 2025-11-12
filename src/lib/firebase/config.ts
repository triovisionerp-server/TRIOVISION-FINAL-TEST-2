import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDA5LO1585YsSfL55Jb1SXehXs5rPsl7FY",
  authDomain: "composite-erp-system-162c0.firebaseapp.com",
  projectId: "composite-erp-system-162c0",
  storageBucket: "composite-erp-system-162c0.firebasestorage.app",
  messagingSenderId: "701532946165",
  appId: "1:701532946165:web:ce1f3d09692e43610ccfbc",
  measurementId: "G-ZY8SC4BJS7"
};

// Initialize Firebase (only once)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
