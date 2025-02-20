import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import React, { createContext, useEffect, useState } from "react";
import { auth } from "../Firebase/firebase.config";

export const AuthContext = createContext(null);
const AuthProvider = ({ children }) => {
  const provider = new GoogleAuthProvider();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const googleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const { email, displayName } = result.user;

      const response = await fetch("http://localhost:5000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, displayName }),
      });

      const data = await response.json();
      console.log("Backend response:", data);
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
    setLoading(false);
  };

  const logout = () => {
    setLoading(true);
    return signOut(auth);
  };

  const info = {
    user,
    loading,
    googleSignIn,
    logout,
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={info}>
      {loading ? (
        <div className="fixed inset-0 flex justify-center items-center bg-blue-900 bg-opacity-50 text-white">
          <span className="loading loading-dots loading-lg"></span>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
