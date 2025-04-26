'use client';

import { useState } from 'react';
import VoiceNavigation from './VoiceNavigation';
import { useTeamMembers } from '@/hooks/useTeamMembers';

export function PersistentVoiceNavigation() {
  const { teamMembers } = useTeamMembers();
  const [isExpanded, setIsExpanded] = useState(false);
  const [transcript, setTranscript] = useState('');

  if (!teamMembers) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '2rem',
      right: '2rem',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: '1rem'
    }}>
      {/* Transcript Display */}
      {isExpanded && transcript && (
        <div style={{
          backgroundColor: 'var(--color-white)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--spacing-4)',
          boxShadow: 'var(--shadow-lg)',
          maxWidth: '300px',
          width: '100%'
        }}>
          <p style={{
            color: 'var(--color-gray-600)',
            fontSize: 'var(--font-size-sm)',
            margin: 0
          }}>
            {transcript}
          </p>
        </div>
      )}

      {/* Voice Navigation Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          backgroundColor: 'var(--color-blue-600)',
          color: 'var(--color-white)',
          border: 'none',
          borderRadius: 'var(--radius-full)',
          width: '48px',
          height: '48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: 'var(--shadow-md)',
          transition: 'transform 0.2s ease-in-out',
          transform: isExpanded ? 'scale(1.1)' : 'scale(1)'
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <line x1="12" y1="19" x2="12" y2="23" />
          <line x1="8" y1="23" x2="16" y2="23" />
        </svg>
      </button>

      {/* Hidden VoiceNavigation component */}
      <div style={{ display: 'none' }}>
        <VoiceNavigation
          teamMembers={teamMembers}
          onTranscriptChange={setTranscript}
          isListening={isExpanded}
        />
      </div>
    </div>
  );
} 