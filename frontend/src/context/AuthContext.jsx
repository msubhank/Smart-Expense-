import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sign up with Email and Password
  async function signup(email, password, displayName = '') {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName && userCredential.user) {
      await updateProfile(userCredential.user, { displayName });
      setCurrentUser({ ...userCredential.user, displayName });
    }
    return userCredential;
  }

  // Sign in with Email and Password
  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  // Sign in with Google One-Click
  function loginWithGoogle() {
    return signInWithPopup(auth, googleProvider);
  }

  // Sign out
  function logout() {
    return signOut(auth);
  }

  // Get current Firebase ID Token (JWT)
  async function getIdToken(forceRefresh = false) {
    if (!currentUser) return null;
    return await currentUser.getIdToken(forceRefresh);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,
    signup,
    login,
    loginWithGoogle,
    logout,
    getIdToken
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs text-slate-500 font-medium tracking-wide">Initializing SmartExpense...</p>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
