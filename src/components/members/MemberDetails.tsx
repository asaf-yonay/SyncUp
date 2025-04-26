'use client';

import { useState, useEffect } from 'react';
import { TeamMember, ActionItem } from '@/lib/types';
import { useData } from '@/components/providers/DataProvider';
import { actionItemRepository } from '@/lib/data';
import { ActionItems } from '@/components/dashboard/ActionItems';

interface MemberDetailsProps {
  memberId: string;
}

export function MemberDetails({ memberId }: MemberDetailsProps) {
  const { teamMembers, isLoading, error } = useData();
  const [actionItems, setActionItems] = useState<ActionItem[]>([]);

  useEffect(() => {
    async function loadActionItems() {
      try {
        const items = await actionItemRepository.findByMemberId(memberId);
        setActionItems(items);
      } catch (err) {
        console.error('Error loading action items:', err instanceof Error ? err.message : 'Failed to load action items');
      }
    }

    loadActionItems();
  }, [memberId]);

  if (isLoading) {
    return (
      <div style={{ 
        padding: 'var(--spacing-6)',
        backgroundColor: 'var(--color-white)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-md)'
      }}>
        <p>Loading member details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        padding: 'var(--spacing-6)',
        backgroundColor: 'var(--color-white)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-md)',
        color: 'var(--color-red-600)'
      }}>
        <p>Error loading member details: {error.message}</p>
      </div>
    );
  }

  const member = teamMembers.find(m => m.id === memberId);

  if (!member) {
    return (
      <div style={{ 
        padding: 'var(--spacing-6)',
        backgroundColor: 'var(--color-white)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-md)',
        color: 'var(--color-red-600)'
      }}>
        <p>Member not found</p>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: 'var(--spacing-6)',
      backgroundColor: 'var(--color-white)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-md)'
    }}>
      <div style={{ 
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-4)',
        marginBottom: 'var(--spacing-6)'
      }}>
        <div style={{ 
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          backgroundColor: 'var(--color-blue-100)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-blue-600)',
          fontWeight: 'var(--font-weight-semibold)',
          fontSize: 'var(--font-size-2xl)'
        }}>
          {member.name.charAt(0)}
        </div>
        <div>
          <h1 style={{ 
            fontSize: 'var(--font-size-2xl)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--color-gray-900)',
            marginBottom: 'var(--spacing-2)'
          }}>
            {member.name}
          </h1>
          <p style={{ 
            color: 'var(--color-gray-600)',
            fontSize: 'var(--font-size-lg)',
            marginBottom: 'var(--spacing-2)'
          }}>
            {member.role}
          </p>
          <p style={{ 
            color: 'var(--color-gray-500)',
            fontSize: 'var(--font-size-base)'
          }}>
            {member.email}
          </p>
        </div>
      </div>

      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 'var(--spacing-4)',
        marginTop: 'var(--spacing-6)'
      }}>
        <div style={{ 
          padding: 'var(--spacing-4)',
          backgroundColor: 'var(--color-gray-50)',
          borderRadius: 'var(--radius-md)'
        }}>
          <p style={{ 
            color: 'var(--color-gray-600)',
            fontSize: 'var(--font-size-sm)',
            marginBottom: 'var(--spacing-1)'
          }}>
            Member Since
          </p>
          <p style={{ 
            color: 'var(--color-gray-900)',
            fontSize: 'var(--font-size-base)',
            fontWeight: 'var(--font-weight-medium)'
          }}>
            {new Date(member.created_at).toLocaleDateString()}
          </p>
        </div>

        <div style={{ 
          padding: 'var(--spacing-4)',
          backgroundColor: 'var(--color-gray-50)',
          borderRadius: 'var(--radius-md)'
        }}>
          <p style={{ 
            color: 'var(--color-gray-600)',
            fontSize: 'var(--font-size-sm)',
            marginBottom: 'var(--spacing-1)'
          }}>
            Manager
          </p>
          <p style={{ 
            color: 'var(--color-gray-900)',
            fontSize: 'var(--font-size-base)',
            fontWeight: 'var(--font-weight-medium)'
          }}>
            {member.manager_id ? 'Has Manager' : 'No Manager'}
          </p>
        </div>
      </div>

      <div style={{ marginTop: 'var(--spacing-6)' }}>
        <ActionItems items={actionItems} />
      </div>
    </div>
  );
} 