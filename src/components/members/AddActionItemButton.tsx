'use client';

import { useState } from 'react';
import { ActionItemForm } from './ActionItemForm';

interface AddActionItemButtonProps {
  memberId: string;
}

export function AddActionItemButton({ memberId }: AddActionItemButtonProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsFormOpen(true)}
        style={{
          padding: 'var(--spacing-2) var(--spacing-4)',
          backgroundColor: 'var(--color-blue-600)',
          color: 'var(--color-white)',
          borderRadius: 'var(--radius-md)',
          border: 'none',
          cursor: 'pointer',
          fontSize: 'var(--font-size-sm)',
          fontWeight: 'var(--font-weight-medium)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-2)'
        }}
      >
        <span>+</span>
        Add Action Item
      </button>

      {isFormOpen && (
        <ActionItemForm
          memberId={memberId}
          onClose={() => setIsFormOpen(false)}
        />
      )}
    </>
  );
} 