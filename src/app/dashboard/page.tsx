'use client';

import { useAuth } from '@/hooks/useAuth';
import { TeamMembers } from '@/components/dashboard/TeamMembers';
import { ActionItems } from '@/components/dashboard/ActionItems';
import { useData } from '@/components/providers/DataProvider';
import '@/styles/variables.css';

export default function DashboardPage() {
  const { user } = useAuth();
  const { teamMembers, actionItems, isLoading, error } = useData();

  if (isLoading) {
    return (
      <div style={{ 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--color-red-600)'
      }}>
        <p>Error: {error.message}</p>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      padding: 'var(--spacing-8)',
      maxWidth: 'var(--max-width-7xl)',
      margin: '0 auto'
    }}>
      <div style={{ 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 'var(--spacing-8)'
      }}>
        <h1 style={{ 
          fontSize: 'var(--font-size-2xl)',
          fontWeight: 'var(--font-weight-bold)',
          color: 'var(--color-gray-900)'
        }}>
          Dashboard
        </h1>
        <p style={{ 
          color: 'var(--color-gray-600)'
        }}>
          Welcome, {user?.email}
        </p>
      </div>

      <TeamMembers members={teamMembers} />
      <ActionItems items={actionItems} />
    </div>
  );
} 