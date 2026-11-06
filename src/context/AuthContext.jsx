
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import { onAuthStateChanged } from 'firebase/auth';
import { getAuthInstance, logoutUser } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe = null;
    let mounted = true;

    const initializeAuthListener = async () => {
      try {
        const auth = await getAuthInstance();

        if (!mounted) return;

        unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          if (mounted) {
            setUser(currentUser);
            setLoading(false);
          }
        });
      } catch (error) {
        console.error('Authentication initialization error:', error);

        if (mounted) {
          setUser(null);
          setLoading(false);
        }
      }
    };

    initializeAuthListener();

    return () => {
      mounted = false;

      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const logout = async () => {
    await logoutUser();
  };

  const value = {
    user,
    loading,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}
