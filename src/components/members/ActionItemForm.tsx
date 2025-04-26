'use client';

import { useState } from 'react';

interface ActionItemFormProps {
  memberId: string;
  onClose: () => void;
}

export function ActionItemForm({ memberId, onClose }: ActionItemFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [due_date, setDueDate] = useState('');
  const [priority, setPriority] = useState('medium');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/action-items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          due_date,
          priority,
          member_id: memberId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create action item');
      }

      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'var(--color-white)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--spacing-6)',
        width: '100%',
        maxWidth: '500px',
        boxShadow: 'var(--shadow-xl)'
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
            Add Action Item
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: 'var(--font-size-xl)',
              color: 'var(--color-gray-500)'
            }}
          >
            ×
          </button>
        </div>

        {error && (
          <div style={{
            padding: 'var(--spacing-3)',
            backgroundColor: 'var(--color-red-50)',
            color: 'var(--color-red-600)',
            borderRadius: 'var(--radius-md)',
            marginBottom: 'var(--spacing-4)'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 'var(--spacing-4)' }}>
            <label style={{
              display: 'block',
              marginBottom: 'var(--spacing-2)',
              color: 'var(--color-gray-700)',
              fontSize: 'var(--font-size-sm)',
              fontWeight: 'var(--font-weight-medium)'
            }}>
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{
                width: '100%',
                padding: 'var(--spacing-2) var(--spacing-3)',
                border: '1px solid var(--color-gray-300)',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--font-size-base)'
              }}
            />
          </div>

          <div style={{ marginBottom: 'var(--spacing-4)' }}>
            <label style={{
              display: 'block',
              marginBottom: 'var(--spacing-2)',
              color: 'var(--color-gray-700)',
              fontSize: 'var(--font-size-sm)',
              fontWeight: 'var(--font-weight-medium)'
            }}>
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              style={{
                width: '100%',
                padding: 'var(--spacing-2) var(--spacing-3)',
                border: '1px solid var(--color-gray-300)',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--font-size-base)',
                minHeight: '100px'
              }}
            />
          </div>

          <div style={{ marginBottom: 'var(--spacing-4)' }}>
            <label style={{
              display: 'block',
              marginBottom: 'var(--spacing-2)',
              color: 'var(--color-gray-700)',
              fontSize: 'var(--font-size-sm)',
              fontWeight: 'var(--font-weight-medium)'
            }}>
              Due Date
            </label>
            <input
              type="date"
              value={due_date}
              onChange={(e) => setDueDate(e.target.value)}
              required
              style={{
                width: '100%',
                padding: 'var(--spacing-2) var(--spacing-3)',
                border: '1px solid var(--color-gray-300)',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--font-size-base)'
              }}
            />
          </div>

          <div style={{ marginBottom: 'var(--spacing-6)' }}>
            <label style={{
              display: 'block',
              marginBottom: 'var(--spacing-2)',
              color: 'var(--color-gray-700)',
              fontSize: 'var(--font-size-sm)',
              fontWeight: 'var(--font-weight-medium)'
            }}>
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              style={{
                width: '100%',
                padding: 'var(--spacing-2) var(--spacing-3)',
                border: '1px solid var(--color-gray-300)',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--font-size-base)'
              }}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 'var(--spacing-3)'
          }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: 'var(--spacing-2) var(--spacing-4)',
                backgroundColor: 'var(--color-gray-100)',
                color: 'var(--color-gray-700)',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                cursor: 'pointer',
                fontSize: 'var(--font-size-sm)',
                fontWeight: 'var(--font-weight-medium)'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: 'var(--spacing-2) var(--spacing-4)',
                backgroundColor: 'var(--color-blue-600)',
                color: 'var(--color-white)',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                cursor: 'pointer',
                fontSize: 'var(--font-size-sm)',
                fontWeight: 'var(--font-weight-medium)',
                opacity: isSubmitting ? 0.7 : 1
              }}
            >
              {isSubmitting ? 'Adding...' : 'Add Action Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 