'use client';

import { ReactNode } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div style={{ padding: 'var(--spacing-6)' }}>
      {children}
    </div>
  );
} 