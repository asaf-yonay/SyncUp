'use client';

import { useAuth } from '@/hooks/useAuth';
import { TeamMembers } from '@/components/dashboard/TeamMembers';
import { ActionItems } from '@/components/dashboard/ActionItems';
import { ActionItem, TeamMember } from '@/types';
import '@/styles/variables.css';

// Temporary mock data - will be replaced with real data from Supabase
const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Senior Developer',
    managerId: null,
    department: 'Engineering',
    objectives: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'Product Manager',
    managerId: '1',
    department: 'Product',
    objectives: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

const mockActionItems: ActionItem[] = [
  {
    id: '1',
    title: 'Complete project documentation',
    description: 'Update all API documentation and user guides',
    status: 'pending' as const,
    due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    objective_id: '1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Review pull requests',
    description: 'Review and merge pending pull requests',
    status: 'completed' as const,
    due_date: new Date().toISOString(),
    objective_id: '2',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export default function DashboardPage() {
  const { user } = useAuth();

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

      <TeamMembers members={mockTeamMembers} />
      <ActionItems items={mockActionItems} />
    </div>
  );
} 