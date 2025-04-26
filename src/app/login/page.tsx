'use client';

import { supabase } from '@/lib/supabase';
import '@/styles/variables.css';

export default function LoginPage() {
  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error('Error logging in:', error.message);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{ 
        width: '100%',
        maxWidth: 'var(--max-width-md)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-8)'
      }}>
        <div>
          <h2 style={{ 
            marginTop: 'var(--spacing-6)',
            textAlign: 'center',
            fontSize: 'var(--font-size-3xl)',
            fontWeight: 'var(--font-weight-bold)',
            letterSpacing: 'var(--tracking-tight)'
          }}>
            Sign in to your account
          </h2>
        </div>
        <div>
          <button
            onClick={handleLogin}
            style={{ 
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-blue-600)',
              padding: 'var(--spacing-2) var(--spacing-3)',
              fontSize: 'var(--font-size-sm)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--color-white)',
              cursor: 'pointer',
              border: 'none',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-blue-500)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-blue-600)'}
            onFocus={(e) => {
              e.currentTarget.style.outline = '2px solid var(--color-blue-600)';
              e.currentTarget.style.outlineOffset = '2px';
            }}
            onBlur={(e) => {
              e.currentTarget.style.outline = 'none';
              e.currentTarget.style.outlineOffset = '0';
            }}
          >
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
} 