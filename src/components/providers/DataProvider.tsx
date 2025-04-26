'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { teamMemberRepository, objectiveRepository, actionItemRepository } from '@/lib/data';
import { TeamMember, Objective, ActionItem } from '@/lib/types';

interface DataContextType {
  teamMembers: TeamMember[];
  objectives: Objective[];
  actionItems: ActionItem[];
  isLoading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

const DataContext = createContext<DataContextType | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [actionItems, setActionItems] = useState<ActionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [members, objectivesData, items] = await Promise.all([
        teamMemberRepository.findAll(),
        objectiveRepository.findAll(),
        actionItemRepository.findAll()
      ]);

      setTeamMembers(members);
      setObjectives(objectivesData);
      setActionItems(items);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch data'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <DataContext.Provider
      value={{
        teamMembers,
        objectives,
        actionItems,
        isLoading,
        error,
        refresh: fetchData
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
} 