import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getAnalytics, Analytics } from 'firebase/analytics';
import { getPerformance, FirebasePerformance } from 'firebase/performance';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

let app: FirebaseApp;
let db: Firestore;
let storage: FirebaseStorage;
let analytics: Analytics | null = null;
let performance: FirebasePerformance | null = null;

// Initialize Firebase only if it hasn't been initialized yet
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  storage = getStorage(app);
  
  // Initialize analytics and performance monitoring only in browser environment
  if (typeof window !== 'undefined') {
    analytics = getAnalytics(app);
    
    // Enable performance monitoring in production
    if (process.env.NODE_ENV === 'production' || 
        process.env.NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING === 'true') {
      performance = getPerformance(app);
    }
  }
} else {
  app = getApps()[0];
  db = getFirestore(app);
  storage = getStorage(app);
  
  if (typeof window !== 'undefined') {
    analytics = getAnalytics(app);
    
    if (process.env.NODE_ENV === 'production' || 
        process.env.NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING === 'true') {
      performance = getPerformance(app);
    }
  }
}

export { app, db, storage, analytics, performance };
