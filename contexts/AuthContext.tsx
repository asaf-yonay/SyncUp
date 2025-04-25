'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { mockTeamMembers, verifyCredentials, getTeamMemberByEmail } from '../lib/mockData';

// For development/testing, use mock values if env vars are not set
const isDevelopment = !process.env.NEXT_PUBLIC_SUPABASE_URL;

// Create a mock implementation for development
const mockSupabase = {
  auth: {
    getSession: async () => ({ data: { session: { user: null } }, error: null }),
    onAuthStateChange: (callback: (event: string, session: any) => void) => {
      return { data: { subscription: { unsubscribe: () => {} } } };
    },
    signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
      if (verifyCredentials(email, password)) {
        const user = getTeamMemberByEmail(email);
        return { data: { user }, error: null };
      }
      return { data: { user: null }, error: { message: 'Invalid credentials' } };
    },
    signOut: async () => ({ error: null }),
    signUp: async ({ email, password, options }: { email: string; password: string; options: any }) => {
      const user = {
        id: String(mockTeamMembers.length + 1),
        email,
        name: options?.data?.name || 'New User',
        role: options?.data?.role || 'Developer'
      };
      return { data: { user }, error: null };
    }
  },
  from: () => ({
    insert: async () => ({ error: null })
  })
};

// Create the Supabase client only in production
let supabase: typeof mockSupabase | SupabaseClient;
if (!isDevelopment) {
  try {
    supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );
  } catch (error) {
    console.error('Failed to create Supabase client:', error);
    // Fall back to mock implementation if Supabase client creation fails
    supabase = mockSupabase;
  }
} else {
  supabase = mockSupabase;
}

interface AuthContextType {
  user: any;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string, name: string, role: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        setUser(null);
        router.push('/login');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    if (data.user) {
      setUser(data.user);
      router.push('/');
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
    router.push('/login');
  };

  const signUp = async (email: string, password: string, name: string, role: string) => {
    const { error: signUpError, data } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: {
          name,
          role
        }
      }
    });
    if (signUpError) throw signUpError;

    if (data.user) {
      await supabase.from('team_members').insert({
        id: data.user.id,
        name,
        email,
        role,
        managerId: null
      });
      setUser(data.user);
      router.push('/');
    }
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, signUp }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext); 