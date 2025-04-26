'use client';

import { TeamMember } from '@/types';

interface TeamMembersProps {
  members: TeamMember[];
}

export function TeamMembers({ members }: TeamMembersProps) {
  return (
    <div style={{ 
      backgroundColor: 'var(--color-white)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-md)',
      padding: 'var(--spacing-6)',
      marginBottom: 'var(--spacing-6)'
    }}>
      <div style={{ 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 'var(--spacing-4)'
      }}>
        <h2 style={{ 
          fontSize: 'var(--font-size-xl)',
          fontWeight: 'var(--font-weight-semibold)',
          color: 'var(--color-gray-900)'
        }}>
          Team Members
        </h2>
        <span style={{ 
          color: 'var(--color-gray-500)',
          fontSize: 'var(--font-size-sm)'
        }}>
          {members.length} members
        </span>
      </div>
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: 'var(--spacing-4)'
      }}>
        {members.map((member) => (
          <div 
            key={member.id} 
            style={{ 
              padding: 'var(--spacing-4)',
              border: '1px solid var(--color-gray-200)',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-white)',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-3)',
              marginBottom: 'var(--spacing-3)'
            }}>
              <div style={{ 
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-blue-100)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-blue-600)',
                fontWeight: 'var(--font-weight-semibold)',
                fontSize: 'var(--font-size-lg)'
              }}>
                {member.name.charAt(0)}
              </div>
              <div>
                <h3 style={{ 
                  fontSize: 'var(--font-size-lg)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--color-gray-900)',
                  marginBottom: 'var(--spacing-1)'
                }}>
                  {member.name}
                </h3>
                <p style={{ 
                  color: 'var(--color-gray-600)',
                  fontSize: 'var(--font-size-sm)'
                }}>
                  {member.role}
                </p>
              </div>
            </div>
            <div style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-2)',
              color: 'var(--color-gray-500)',
              fontSize: 'var(--font-size-sm)'
            }}>
              <span style={{ 
                display: 'inline-block',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-blue-500)'
              }} />
              {member.department}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 