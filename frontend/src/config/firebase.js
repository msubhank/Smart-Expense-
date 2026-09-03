import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

/**
 * Firebase Client SDK Configuration (Web Modular API).
 * Values are dynamically read from Vite environment variables (.env).
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'demo-api-key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'smart-expense-app.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'smart-expense-app',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'smart-expense-app.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789012',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:123456789012:web:abcdef1234567890'
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Export Authentication instances
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
