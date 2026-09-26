import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile as updateAuthProfile,
} from "firebase/auth";
import { auth } from "../firebase";
import { getProfile, saveProfile } from "../services/db";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          setProfile((await getProfile(firebaseUser.uid)) || {});
        } catch (err) {
          console.error("Could not load profile", err);
          setProfile({});
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
  }, []);

  const signup = async (name, email, password) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateAuthProfile(cred.user, { displayName: name });
    const initial = { name, email, favourites: [], createdAt: Date.now() };
    await saveProfile(cred.user.uid, initial);
    setProfile(initial);
  };

  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);
  const logout = () => signOut(auth);
  const resetPassword = (email) => sendPasswordResetEmail(auth, email);

  const updateProfile = useCallback(
    async (changes) => {
      await saveProfile(user.uid, changes);
      setProfile((prev) => ({ ...prev, ...changes }));
    },
    [user]
  );

  const toggleFavourite = async (mealId) => {
    const current = profile?.favourites || [];
    const favourites = current.includes(mealId)
      ? current.filter((id) => id !== mealId)
      : [...current, mealId];
    await updateProfile({ favourites });
  };

  const value = {
    user,
    profile,
    loading,
    signup,
    login,
    logout,
    resetPassword,
    updateProfile,
    toggleFavourite,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

// Turns Firebase auth error codes into messages people can act on.
export function authErrorMessage(err) {
  switch (err?.code) {
    case "auth/email-already-in-use":
      return "An account with this email already exists. Try logging in instead.";
    case "auth/invalid-email":
      return "That email address doesn't look right.";
    case "auth/weak-password":
      return "Password must be at least 6 characters.";
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Incorrect email or password.";
    case "auth/too-many-requests":
      return "Too many attempts. Please wait a few minutes and try again.";
    case "auth/network-request-failed":
      return "Network error. Check your internet connection.";
    default:
      return err?.message || "Something went wrong. Please try again.";
  }
}
