import { TeamMember, Objective, ActionItem } from '../types';

// Mock user credentials for development
export const mockCredentials = {
  'asafy3@gmail.com': 'password123',
  'jane@example.com': 'password123',
  'mike@example.com': 'password123'
};

export const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Asaf Yonay',
    email: 'asafy3@gmail.com',
    role: 'Manager',
    managerId: null,
    department: 'Engineering',
    objectives: ['1', '2'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'Senior Developer',
    managerId: '1',
    department: 'Engineering',
    objectives: ['3'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    role: 'Developer',
    managerId: '1',
    department: 'Engineering',
    objectives: ['4'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const mockObjectives: Objective[] = [
  {
    id: '1',
    title: 'Improve Code Quality',
    description: 'Implement better testing practices and code reviews',
    status: 'in-progress',
    due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    team_member_id: '1',
    action_items: ['1', '2'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Team Leadership',
    description: 'Improve team communication and productivity',
    status: 'pending',
    due_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    team_member_id: '1',
    action_items: ['3'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Frontend Optimization',
    description: 'Optimize React components and reduce bundle size',
    status: 'in-progress',
    due_date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
    team_member_id: '2',
    action_items: ['4'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '4',
    title: 'Backend API Development',
    description: 'Implement new API endpoints and improve performance',
    status: 'pending',
    due_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    team_member_id: '3',
    action_items: ['5'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const mockActionItems: ActionItem[] = [
  {
    id: '1',
    title: 'Implement Unit Testing',
    description: 'Add unit tests for core components',
    status: 'pending',
    due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    objective_id: '1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Code Review Process',
    description: 'Establish formal code review process',
    status: 'pending',
    due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    objective_id: '1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Team Meeting Structure',
    description: 'Implement weekly team meetings and standups',
    status: 'pending',
    due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    objective_id: '2',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '4',
    title: 'Component Optimization',
    description: 'Optimize React components for better performance',
    status: 'pending',
    due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    objective_id: '3',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '5',
    title: 'API Documentation',
    description: 'Create comprehensive API documentation',
    status: 'pending',
    due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    objective_id: '4',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Helper functions to simulate database operations
export const getTeamMember = (id: string): TeamMember | undefined => {
  return mockTeamMembers.find(member => member.id === id);
};

export const getTeamMemberByEmail = (email: string): TeamMember | undefined => {
  return mockTeamMembers.find(member => member.email === email);
};

export const verifyCredentials = (email: string, password: string): boolean => {
  return mockCredentials[email as keyof typeof mockCredentials] === password;
};

export const getTeamMembers = (): TeamMember[] => {
  return mockTeamMembers;
};

export const getObjectives = (teamMemberId?: string): Objective[] => {
  if (teamMemberId) {
    return mockObjectives.filter(obj => obj.team_member_id === teamMemberId);
  }
  return mockObjectives;
};

export const getActionItems = (objectiveId?: string): ActionItem[] => {
  if (objectiveId) {
    return mockActionItems.filter(item => item.objective_id === objectiveId);
  }
  return mockActionItems;
};

export const getTeamHierarchy = (): TeamMember[] => {
  return mockTeamMembers.map(member => ({
    ...member,
    children: mockTeamMembers.filter(m => m.managerId === member.id)
  }));
}; 