import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // Disable session persistence temporarily
    autoRefreshToken: true,
    detectSessionInUrl: false
  }
});

// Types for our User schema
export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  type: 'creator' | 'user';
  following: string[];
  purchasedPacks: string[];
}

// Auth helper functions
export const auth = {
  signUp: async (email: string, password: string, name: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            type: 'user',
            avatarUrl: '',
            following: [],
            purchasedPacks: [],
          },
        },
      });
      return { data, error };
    } catch (error) {
      console.error('Sign up error:', error);
      return { data: null, error };
    }
  },

  signIn: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { data, error };
    } catch (error) {
      console.error('Sign in error:', error);
      return { data: null, error };
    }
  },

  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (error) {
      console.error('Sign out error:', error);
      return { error };
    }
  },

  getCurrentUser: async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (user) {
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();
        return { user: userData as User, error };
      }
      return { user: null, error };
    } catch (error) {
      console.error('Get current user error:', error);
      return { user: null, error };
    }
  },

  onAuthStateChange: (callback: (user: User | null) => void) => {
    try {
      return supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          const { data: userData } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();
          callback(userData as User);
        } else {
          callback(null);
        }
      });
    } catch (error) {
      console.error('Auth state change error:', error);
      callback(null);
      return { data: { subscription: { unsubscribe: () => {} } } };
    }
  },
}; 