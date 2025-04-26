'use client';

import { ReactNode } from 'react';

interface LoginLayoutProps {
  children: ReactNode;
}

export function LoginLayout({ children }: LoginLayoutProps) {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--spacing-4)',
      backgroundColor: 'var(--background)'
    }}>
      <div style={{
        maxWidth: '28rem',
        width: '100%'
      }}>
        {children}
      </div>
    </div>
  );
} 