# SQL Examples

## User Management

### Creating a Manager User
```sql
-- First, create the auth user
INSERT INTO auth.users (
  id,
  email,
  raw_user_meta_data
) VALUES (
  '00000000-0000-0000-0000-000000000001', -- You can use any UUID, but this is a simple one
  'asafy3@gmail.com',
  '{"name": "Asaf Yonay", "role": "Manager"}'
);

-- Then create the team member record
INSERT INTO public.team_members (
  id,
  name,
  email,
  role,
  manager_id
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Asaf Yonay',
  'asafy3@gmail.com',
  'Manager',
  NULL
);
```

### Creating a Team Member
```sql
-- First, create the auth user
INSERT INTO auth.users (
  id,
  email,
  raw_user_meta_data
) VALUES (
  '00000000-0000-0000-0000-000000000002',
  'team.member@example.com',
  '{"name": "Team Member", "role": "Developer"}'
);

-- Then create the team member record
INSERT INTO public.team_members (
  id,
  name,
  email,
  role,
  manager_id
) VALUES (
  '00000000-0000-0000-0000-000000000002',
  'Team Member',
  'team.member@example.com',
  'Developer',
  '00000000-0000-0000-0000-000000000001' -- Manager's ID
);
```

## Objective Management

### Creating an Objective
```sql
INSERT INTO public.objectives (
  team_member_id,
  title,
  description,
  status,
  due_date
) VALUES (
  '00000000-0000-0000-0000-000000000002', -- Team member's ID
  'Complete Project X',
  'Finish all tasks related to Project X',
  'pending',
  '2024-03-31 23:59:59+00'
);
```

### Adding Action Items
```sql
INSERT INTO public.action_items (
  objective_id,
  content,
  status
) VALUES (
  '00000000-0000-0000-0000-000000000003', -- Objective's ID
  'Implement authentication flow',
  'pending'
);
```

## Common Queries

### Get All Team Members Under a Manager
```sql
SELECT 
  tm.id,
  tm.name,
  tm.email,
  tm.role
FROM public.team_members tm
WHERE tm.manager_id = '00000000-0000-0000-0000-000000000001'; -- Manager's ID
```

### Get All Objectives for a Team Member
```sql
SELECT 
  o.id,
  o.title,
  o.description,
  o.status,
  o.due_date
FROM public.objectives o
WHERE o.team_member_id = '00000000-0000-0000-0000-000000000002'; -- Team member's ID
```

### Get All Action Items for an Objective
```sql
SELECT 
  ai.id,
  ai.content,
  ai.status,
  ai.created_at
FROM public.action_items ai
WHERE ai.objective_id = '00000000-0000-0000-0000-000000000003'; -- Objective's ID
```

## Data Cleanup

### Delete a Team Member and Their Data
```sql
-- First, delete action items
DELETE FROM public.action_items
WHERE objective_id IN (
  SELECT id FROM public.objectives
  WHERE team_member_id = '00000000-0000-0000-0000-000000000002'
);

-- Then delete objectives
DELETE FROM public.objectives
WHERE team_member_id = '00000000-0000-0000-0000-000000000002';

-- Finally, delete the team member
DELETE FROM public.team_members
WHERE id = '00000000-0000-0000-0000-000000000002';

-- And delete the auth user
DELETE FROM auth.users
WHERE id = '00000000-0000-0000-0000-000000000002';
```

## Notes
- Always use proper UUIDs in production
- Consider using transactions for multi-step operations
- Be careful with DELETE operations
- Test queries in a development environment first 