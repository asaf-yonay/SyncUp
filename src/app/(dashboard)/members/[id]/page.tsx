'use client';

import { MemberDetails } from '@/components/members/MemberDetails'
import { useRouter } from 'next/navigation'

export default function MemberPage({ params }: { params: { id: string } }) {
  const router = useRouter();

  return (
    <div style={{ 
      padding: 'var(--spacing-8)',
      maxWidth: 'var(--max-width-7xl)',
      margin: '0 auto'
    }}>
      <div style={{ 
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-4)',
        marginBottom: 'var(--spacing-6)'
      }}>
        <button
          onClick={() => router.back()}
          style={{ 
            padding: 'var(--spacing-2) var(--spacing-4)',
            backgroundColor: 'var(--color-gray-100)',
            color: 'var(--color-gray-700)',
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
          ← Back
        </button>
        <h1 style={{ 
          fontSize: 'var(--font-size-2xl)',
          fontWeight: 'var(--font-weight-bold)',
          color: 'var(--color-gray-900)'
        }}>
          Member Details
        </h1>
      </div>

      <MemberDetails memberId={params.id} />
    </div>
  )
} 