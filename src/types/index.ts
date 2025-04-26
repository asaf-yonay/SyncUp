export type { TeamMember, Objective, ActionItem } from '@/lib/types';
export type Status = 'pending' | 'in-progress' | 'completed';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  managerId: string | null;
  department: string;
  objectives: string[];
  created_at: string;
  updated_at: string;
}

export interface Objective {
  id: string;
  title: string;
  description: string;
  status: Status;
  due_date: string;
  team_member_id: string;
  action_items: string[];
  created_at: string;
  updated_at: string;
}

export interface ActionItem {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'completed';
  due_date: string;
  objective_id: string;
  created_at: string;
  updated_at: string;
} 