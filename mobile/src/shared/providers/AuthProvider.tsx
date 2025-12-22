import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { tokenStorage } from '../lib/storage';
import { setAuthToken } from '../lib/http';

type AuthContextValue = {
  token: string | null;
  isAuthed: boolean;
  loading: boolean;
  signIn: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const t = await tokenStorage.get();
        setToken(t);
        setAuthToken(t);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const signIn = async (newToken: string) => {
    await tokenStorage.set(newToken);
    setToken(newToken);
    setAuthToken(newToken);
  };

  const signOut = async () => {
    console.log('signOut');
    try {
      await tokenStorage.clear();
      setToken(null);
      setAuthToken(null);
    } catch (error) {
      console.error(error);
    }
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      isAuthed: !!token,
      loading,
      signIn,
      signOut,
    }),
    [token, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}