-- First, update Asaf's role to Manager
UPDATE public.team_members
SET role = 'Manager'
WHERE id = '235b571a-a814-4831-94c1-8f71f82d16f1';

-- Verify the team members are properly linked to Asaf
UPDATE public.team_members
SET manager_id = '235b571a-a814-4831-94c1-8f71f82d16f1'
WHERE email IN ('alice.smith@example.com', 'bob.johnson@example.com');

-- Add some objectives for Asaf
INSERT INTO public.objectives (
  team_member_id,
  title,
  description,
  status,
  due_date
) VALUES 
  (
    '235b571a-a814-4831-94c1-8f71f82d16f1',
    'Team Management',
    'Oversee and support team members',
    'pending',
    '2024-12-31 23:59:59+00'
  ),
  (
    '235b571a-a814-4831-94c1-8f71f82d16f1',
    'Project Planning',
    'Plan and coordinate project milestones',
    'pending',
    '2024-12-31 23:59:59+00'
  );

-- Add action items for Asaf's objectives
INSERT INTO public.action_items (
  objective_id,
  content,
  status
) VALUES 
  (
    (SELECT id FROM public.objectives WHERE title = 'Team Management' AND team_member_id = '235b571a-a814-4831-94c1-8f71f82d16f1'),
    'Conduct weekly team meetings',
    'pending'
  ),
  (
    (SELECT id FROM public.objectives WHERE title = 'Team Management' AND team_member_id = '235b571a-a814-4831-94c1-8f71f82d16f1'),
    'Review team member progress',
    'pending'
  ),
  (
    (SELECT id FROM public.objectives WHERE title = 'Project Planning' AND team_member_id = '235b571a-a814-4831-94c1-8f71f82d16f1'),
    'Create project timeline',
    'pending'
  ); 