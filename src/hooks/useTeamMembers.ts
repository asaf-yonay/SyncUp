'use client';

import { useState, useEffect } from 'react';
import { TeamMember } from '@/lib/types';
import { supabase } from '@/lib/supabase';

export function useTeamMembers() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTeamMembers() {
      try {
        const { data, error } = await supabase
          .from('team_members')
          .select('*')
          .order('name');

        if (error) throw error;

        setTeamMembers(data || []);
      } catch (err) {
        console.error('Error fetching team members:', err);
        setError('Failed to fetch team members');
      } finally {
        setLoading(false);
      }
    }

    fetchTeamMembers();
  }, []);

  return { teamMembers, loading, error };
} 