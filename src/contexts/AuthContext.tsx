import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, User } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: Error | null;
  signIn: (email: string, password: string) => Promise<{ data: any; error: any }>;
  signUp: (email: string, password: string, name: string) => Promise<{ data: any; error: any }>;
  signOut: () => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const { user: currentUser } = await auth.getCurrentUser();
        if (mounted) {
          setUser(currentUser);
          setLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError(err as Error);
          setLoading(false);
        }
      }
    };

    initializeAuth();

    const { data: { subscription } } = auth.onAuthStateChange((user) => {
      if (mounted) {
        setUser(user);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const value = {
    user,
    loading,
    error,
    signIn: auth.signIn,
    signUp: auth.signUp,
    signOut: auth.signOut,
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 