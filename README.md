# Team Objectives Manager

A mobile-friendly web application for managing team objectives with voice navigation capabilities.

## Features

- Authentication and authorization
- Voice navigation
- Team member management
- Objectives tracking
- Mobile-friendly interface
- Organization chart visualization
- Email notifications

## Prerequisites

- Node.js 16.x or later
- A Supabase account
- SMTP server for email notifications

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd team-objectives
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory with the following content:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# SMTP Configuration
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-smtp-username
SMTP_PASSWORD=your-smtp-password
SMTP_FROM=noreply@yourdomain.com
```

4. Set up the Supabase database tables:

```sql
-- Create team_members table
create table team_members (
  id uuid references auth.users on delete cascade,
  name text not null,
  email text not null unique,
  role text not null,
  manager_id uuid references team_members(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create objectives table
create table objectives (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  status text not null default 'pending',
  due_date timestamp with time zone,
  team_member_id uuid references team_members(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create action_items table
create table action_items (
  id uuid default uuid_generate_v4() primary key,
  content text not null,
  status text not null default 'pending',
  objective_id uuid references objectives(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table team_members enable row level security;
alter table objectives enable row level security;
alter table action_items enable row level security;

-- Create policies
create policy "Users can view their own and their team members' data"
  on team_members for select
  using (
    auth.uid() = id or
    auth.uid() in (
      select tm.id
      from team_members tm
      where tm.manager_id = auth.uid()
    )
  );

create policy "Users can view their own and their team members' objectives"
  on objectives for select
  using (
    team_member_id = auth.uid() or
    auth.uid() in (
      select tm.id
      from team_members tm
      where tm.manager_id = team_member_id
    )
  );

create policy "Users can view their own and their team members' action items"
  on action_items for select
  using (
    objective_id in (
      select o.id
      from objectives o
      where o.team_member_id = auth.uid() or
      auth.uid() in (
        select tm.id
        from team_members tm
        where tm.manager_id = o.team_member_id
      )
    )
  );
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Voice Commands

The application supports the following voice commands:

- "Go to [team member name]" - Navigate to a team member's page
- "Add action item [content] for [team member name]" - Add a new action item for a team member

## Mobile Usage

The application is designed to be mobile-friendly and can be accessed through any modern mobile browser. For the best experience:

1. Open the application in your mobile browser
2. Add it to your home screen for quick access
3. Allow microphone permissions for voice navigation

## Security

- Authentication is handled through Supabase
- Row Level Security ensures data access control
- Managers can only see their team members' data
- Team members can only see their own data
- All API routes are protected

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request 