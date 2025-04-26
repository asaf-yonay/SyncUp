# Database Schema

## Tables

### team_members
Stores information about team members and their hierarchy.

| Column     | Type                     | Description                          |
|------------|--------------------------|--------------------------------------|
| id         | UUID                     | Primary key, references auth.users   |
| name       | TEXT                     | Full name of the team member        |
| email      | TEXT                     | Email address (unique)              |
| role       | TEXT                     | Role in the organization            |
| manager_id | UUID                     | ID of the manager (self-reference)  |
| created_at | TIMESTAMP WITH TIME ZONE | Record creation timestamp           |

### objectives
Tracks team member objectives and their status.

| Column        | Type                     | Description                          |
|---------------|--------------------------|--------------------------------------|
| id            | UUID                     | Primary key                         |
| team_member_id| UUID                     | References team_members.id          |
| title         | TEXT                     | Objective title                     |
| description   | TEXT                     | Detailed description                |
| status        | TEXT                     | Current status (pending/completed)  |
| due_date      | TIMESTAMP WITH TIME ZONE | Target completion date              |
| created_at    | TIMESTAMP WITH TIME ZONE | Record creation timestamp           |

### action_items
Stores individual tasks that can be either standalone or linked to objectives.

| Column        | Type                     | Description                          |
|---------------|--------------------------|--------------------------------------|
| id            | UUID                     | Primary key                         |
| title         | TEXT                     | Task title                          |
| description   | TEXT                     | Task description                    |
| due_date      | TIMESTAMP WITH TIME ZONE | Target completion date              |
| priority      | TEXT                     | Priority level (low/medium/high)    |
| status        | TEXT                     | Current status (pending/in-progress/completed) |
| member_id     | UUID                     | References team_members.id          |
| objective_id  | UUID                     | Optional reference to objectives.id |
| created_at    | TIMESTAMP WITH TIME ZONE | Record creation timestamp           |
| updated_at    | TIMESTAMP WITH TIME ZONE | Last update timestamp               |

## Relationships

- `team_members.manager_id` → `team_members.id` (self-reference)
- `objectives.team_member_id` → `team_members.id`
- `action_items.objective_id` → `objectives.id` (optional)
- `action_items.member_id` → `team_members.id`

## Row Level Security (RLS) Policies

### team_members
- Users can view their own record
- Users can view records of team members they manage

### objectives
- Users can view their own objectives
- Users can view objectives of team members they manage

### action_items
- Users can view their own action items
- Users can view action items linked to their objectives
- Users can view action items of team members they manage
- Users can create/update/delete their own action items
- Managers can create/update/delete action items for their team members

## Automatic User Creation

When a new user signs up through Google OAuth:
1. A record is automatically created in `auth.users`
2. A trigger creates a corresponding record in `team_members`
3. The user is assigned the default role of 'Developer'

## Indexes

- `team_members.email` (unique)
- `team_members.manager_id`
- `objectives.team_member_id`
- `action_items.objective_id`
- `action_items.member_id`
- `action_items.due_date` 