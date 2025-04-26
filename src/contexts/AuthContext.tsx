'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

// Create the Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      storage: {
        getItem: (key) => {
          try {
            return localStorage.getItem(key);
          } catch (error) {
            return null;
          }
        },
        setItem: (key, value) => {
          try {
            localStorage.setItem(key, value);
          } catch (error) {
            console.error('Error setting auth storage:', error);
          }
        },
        removeItem: (key) => {
          try {
            localStorage.removeItem(key);
          } catch (error) {
            console.error('Error removing auth storage:', error);
          }
        }
      }
    }
  }
);

interface AuthContextType {
  user: any;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session);
      if (session?.user) {
        setUser(session.user);
        // Get the pre-auth URL and redirect there
        const preAuthUrl = localStorage.getItem('preAuthUrl');
        if (preAuthUrl && preAuthUrl !== '/login') {
          localStorage.removeItem('preAuthUrl');
          router.push(preAuthUrl);
        } else {
          router.push('/');
        }
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session);
      if (session?.user) {
        setUser(session.user);
        // Get the pre-auth URL and redirect there
        const preAuthUrl = localStorage.getItem('preAuthUrl');
        if (preAuthUrl && preAuthUrl !== '/login') {
          localStorage.removeItem('preAuthUrl');
          router.push(preAuthUrl);
        } else {
          router.push('/');
        }
      } else {
        setUser(null);
        // Only redirect to login if we're not already there
        if (window.location.pathname !== '/login') {
          router.push('/login');
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  const signInWithGoogle = async () => {
    try {
      console.log('Initiating Google OAuth...');
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        }
      });

      if (error) {
        console.error('Google sign-in error:', error);
        throw error;
      }

      if (data?.url) {
        console.log('Redirecting to:', data.url);
        // Store the current URL to redirect back after auth
        localStorage.setItem('preAuthUrl', window.location.pathname);
        window.location.href = data.url;
      }
    } catch (err) {
      console.error('Unexpected error during Google sign-in:', err);
      throw err;
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext); 