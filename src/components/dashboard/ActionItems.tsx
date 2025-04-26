'use client';

import { ActionItem } from '@/lib/types';

interface ActionItemsProps {
  items: ActionItem[];
}

function formatDate(dateString: string): string {
  console.log('Formatting date:', dateString);
  try {
    const date = new Date(dateString);
    console.log('Parsed date:', date);
    console.log('Date timestamp:', date.getTime());
    console.log('Is valid date:', !isNaN(date.getTime()));
    
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date');
    }

    const formatted = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    console.log('Formatted date:', formatted);
    return formatted;
  } catch (error) {
    console.error('Error formatting date:', error);
    console.error('Original date string:', dateString);
    return 'Invalid date';
  }
}

export function ActionItems({ items }: ActionItemsProps) {
  console.log('ActionItems received items:', items);
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
        {items.map((item) => {
          console.log('Rendering item:', item);
          return (
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
                  {item.title}
                </h3>
                <p style={{ 
                  color: 'var(--color-gray-500)',
                  fontSize: 'var(--font-size-sm)',
                  marginBottom: 'var(--spacing-2)'
                }}>
                  {item.description}
                </p>
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
                  Due: {formatDate(item.due_date)}
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
          );
        })}
      </div>
    </div>
  );
} 