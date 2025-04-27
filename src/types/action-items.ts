export interface ActionItemData {
  title: string;
  description?: string;
  due_date?: string;
  priority?: 'low' | 'medium' | 'high';
} 