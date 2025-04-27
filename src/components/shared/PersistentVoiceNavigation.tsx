'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useTeamMembers } from '@/hooks/useTeamMembers';
import { ActionItemData } from '@/types/action-items';
import './PersistentVoiceNavigation.css';

// Dynamically import VoiceNavigation with no SSR
const VoiceNavigation = dynamic(() => import('./VoiceNavigation'), {
  ssr: false,
});

export default function PersistentVoiceNavigation() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { teamMembers, loading: teamMembersLoading, error: teamMembersError } = useTeamMembers();

  useEffect(() => {
    setIsMounted(true);
    console.log('[PersistentVoiceNavigation] Component mounted');
  }, []);

  const handleAddActionItem = async (memberId: string, data: ActionItemData) => {
    try {
      console.log('[PersistentVoiceNavigation] Adding action item:', { memberId, data });
      const response = await fetch('/api/action-items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          memberId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create action item');
      }

      console.log('[PersistentVoiceNavigation] Action item created successfully');
    } catch (error) {
      console.error('[PersistentVoiceNavigation] Error creating action item:', error);
    }
  };

  const handleCommand = (command: string) => {
    console.log('[PersistentVoiceNavigation] Processing command:', command);
    // Add command processing logic here
  };

  if (!isMounted) {
    console.log('[PersistentVoiceNavigation] Not mounted yet, returning null');
    return null;
  }

  if (teamMembersLoading) {
    console.log('[PersistentVoiceNavigation] Loading team members');
    return null;
  }

  if (teamMembersError) {
    console.error('[PersistentVoiceNavigation] Error loading team members:', teamMembersError);
    return null;
  }

  return (
    <div className={`voice-nav-container ${isExpanded ? 'expanded' : ''}`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`voice-nav-button ${isExpanded ? 'active' : ''}`}
        title={isExpanded ? 'Minimize voice navigation' : 'Expand voice navigation'}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`voice-nav-icon ${isExpanded ? 'active' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
          />
        </svg>
      </button>

      {isExpanded && (
        <div className="voice-nav-content">
          <VoiceNavigation
            onCommand={handleCommand}
            onAddActionItem={handleAddActionItem}
            teamMembers={teamMembers || []}
          />
        </div>
      )}
    </div>
  );
} 