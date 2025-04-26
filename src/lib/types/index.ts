export type Status = 'pending' | 'completed';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  manager_id: string | null;
  created_at: string;
}

export interface Objective {
  id: string;
  team_member_id: string;
  title: string;
  description: string;
  status: Status;
  due_date: string;
  created_at: string;
}

export interface ActionItem {
  id: string;
  objective_id: string;
  content: string;
  status: Status;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      team_members: {
        Row: TeamMember;
        Insert: Omit<TeamMember, 'id' | 'created_at'>;
        Update: Partial<Omit<TeamMember, 'id' | 'created_at'>>;
      };
      objectives: {
        Row: Objective;
        Insert: Omit<Objective, 'id' | 'created_at'>;
        Update: Partial<Omit<Objective, 'id' | 'created_at'>>;
      };
      action_items: {
        Row: ActionItem;
        Insert: Omit<ActionItem, 'id' | 'created_at'>;
        Update: Partial<Omit<ActionItem, 'id' | 'created_at'>>;
      };
    };
  };
} 