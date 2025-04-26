import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface UserData {
  teamMember: {
    id: string;
    name: string;
    email: string;
    role: string;
    manager_id: string | null;
    created_at: string;
    updated_at: string;
  } | null;
  objectives: Array<{
    id: string;
    title: string;
    description: string;
    status: string;
    due_date: string;
    team_member_id: string;
    created_at: string;
    updated_at: string;
    action_items: Array<{
      id: string;
      content: string;
      status: string;
      created_at: string;
      updated_at: string;
    }>;
  }>;
  teamMembers: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    manager_id: string;
    created_at: string;
    updated_at: string;
  }>;
}

export function useUserData() {
  const { user } = useAuth();
  const [data, setData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] Starting data fetch for user:`, {
        userId: user?.id,
        email: user?.email
      });

      if (!user) {
        console.log(`[${timestamp}] No user, skipping fetch`);
        setLoading(false);
        return;
      }

      try {
        console.log(`[${timestamp}] Fetching from /api/me`);
        const response = await fetch('/api/me');
        console.log(`[${timestamp}] Response status:`, response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`[${timestamp}] Error response:`, errorText);
          throw new Error('Failed to fetch user data');
        }
        
        const userData = await response.json();
        console.log(`[${timestamp}] Received data:`, {
          hasTeamMember: !!userData.teamMember,
          objectivesCount: userData.objectives?.length,
          teamMembersCount: userData.teamMembers?.length
        });
        
        setData(userData);
      } catch (err) {
        console.error(`[${timestamp}] Error in useUserData:`, err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user]);

  return { data, loading, error };
} 