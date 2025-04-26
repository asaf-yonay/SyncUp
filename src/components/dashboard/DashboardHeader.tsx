'use client';

import { supabase } from '@/lib/supabase';

export function DashboardHeader() {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      marginBottom: 'var(--spacing-6)'
    }}>
      <h1 style={{ 
        fontSize: 'var(--font-size-2xl)', 
        fontWeight: 'var(--font-weight-semibold)'
      }}>
        Dashboard
      </h1>
      <button
        onClick={() => supabase.auth.signOut()}
        style={{
          padding: 'var(--spacing-2) var(--spacing-4)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--background)',
          color: 'var(--foreground)',
          cursor: 'pointer'
        }}
      >
        Sign Out
      </button>
    </div>
  );
} 