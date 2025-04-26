'use client';

import { ActionItem } from '@/lib/types';

interface ActionItemsProps {
  items: ActionItem[];
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}

export function ActionItems({ items }: ActionItemsProps) {
  return (
    <div style={{ 
      backgroundColor: 'var(--color-white)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-md)',
      padding: 'var(--spacing-6)'
    }}>
      <h2 style={{ 
        fontSize: 'var(--font-size-xl)',
        fontWeight: 'var(--font-weight-semibold)',
        marginBottom: 'var(--spacing-4)',
        color: 'var(--color-gray-900)'
      }}>
        My Action Items
      </h2>
      <div style={{ 
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-4)'
      }}>
        {items.map((item) => (
          <div 
            key={item.id} 
            style={{ 
              padding: 'var(--spacing-4)',
              border: '1px solid var(--color-gray-200)',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-white)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
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
            <div>
              <h3 style={{ 
                fontSize: 'var(--font-size-lg)',
                fontWeight: 'var(--font-weight-semibold)',
                marginBottom: 'var(--spacing-2)',
                color: 'var(--color-gray-900)'
              }}>
                {item.content}
              </h3>
              <p style={{ 
                color: 'var(--color-gray-500)',
                fontSize: 'var(--font-size-sm)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-2)'
              }}>
                <span style={{ 
                  display: 'inline-block',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: item.status === 'completed' ? 'var(--color-green-500)' : 'var(--color-yellow-500)'
                }} />
                Created: {formatDate(item.created_at)}
              </p>
            </div>
            <div style={{ 
              padding: 'var(--spacing-2) var(--spacing-3)',
              borderRadius: 'var(--radius-full)',
              backgroundColor: item.status === 'completed' ? 'var(--color-green-100)' : 'var(--color-yellow-100)',
              color: item.status === 'completed' ? 'var(--color-green-800)' : 'var(--color-yellow-800)',
              fontSize: 'var(--font-size-sm)',
              fontWeight: 'var(--font-weight-medium)',
              textTransform: 'capitalize'
            }}>
              {item.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 