# Project Architecture

## Core Principles

1. **Page Organization**
   - All page components must be in `/src/pages`
   - Pages are pure React components that compose layouts and components
   - No business logic in pages, only composition and routing

2. **Routing**
   - All routes are defined in a single location: `/src/app/routes.tsx`
   - Next.js app directory structure is used for routing
   - Route files only import and render pages

3. **Components**
   - All UI components must be in `/src/components`
   - Components are organized by feature/domain
   - Reusable components go in `/src/components/ui`
   - Feature-specific components go in their respective feature folders

4. **Data Layer**
   - Supabase is our single source of truth for data
   - Authentication is handled through Supabase Auth
   - OAuth providers (Google) are configured through Supabase

5. **Development Process**
   - Plan before implementation
   - Get approval before making changes
   - Document decisions and changes

6. **Styling**
   - CSS variables are used for theming and styling
   - No Tailwind CSS
   - Styles are defined in `/src/styles`
   - Component-specific styles are co-located with components

## Directory Structure

```
src/
  ├── components/         # All UI components
  │   ├── ui/            # Reusable UI components
  │   ├── auth/          # Authentication components
  │   ├── dashboard/     # Dashboard components
  │   └── shared/        # Shared components
  ├── pages/             # All page components
  ├── styles/            # Global styles and variables
  ├── lib/               # Utilities and configurations
  │   └── supabase.ts    # Supabase client
  └── app/               # Next.js routing
      └── routes.tsx     # Single routing configuration
```

## Development Workflow

1. **Planning Phase**
   - Discuss requirements and approach
   - Get approval before implementation
   - Document the plan

2. **Implementation Phase**
   - Follow the architecture rules
   - Create/update components in the correct locations
   - Use CSS variables for styling
   - Implement Supabase integration

3. **Review Phase**
   - Verify architecture compliance
   - Test functionality
   - Document any deviations or new patterns

## Tech Stack

- **Frontend**: Next.js with TypeScript
- **Styling**: CSS Variables
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **Email**: Nodemailer
- **Voice Recognition**: Web Speech API

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── members/       # Team member endpoints
│   │   └── send-email/    # Email service endpoint
│   ├── login/             # Login page
│   ├── member/            # Team member pages
│   └── page.tsx           # Main dashboard
├── components/            # Reusable components
│   ├── OrgChart.tsx      # Organization chart visualization
│   └── VoiceNavigation.tsx # Voice command interface
├── contexts/             # React contexts
│   └── AuthContext.tsx   # Authentication context
├── types/                # TypeScript type definitions
│   └── index.ts         # Shared types
└── docs/                # Documentation
```

## Key Components

### Authentication System
- Uses Supabase Auth for user management
- JWT-based authentication
- Row Level Security for data access control
- Custom auth context for state management

### Database Schema
- `team_members`: Stores user profiles and hierarchy
- `objectives`: Tracks team member objectives
- `action_items`: Individual tasks within objectives

### Voice Navigation
- Web Speech API integration
- Command parsing and routing
- Real-time feedback
- Mobile-friendly interface

### Email System
- Nodemailer for SMTP integration
- Welcome emails for new team members
- Notification system for updates

## Security Architecture

1. **Authentication Layer**
   - JWT-based authentication
   - Secure session management
   - Protected API routes

2. **Data Access Control**
   - Row Level Security policies
   - Role-based access control
   - Hierarchical data visibility

3. **API Security**
   - Input validation
   - Rate limiting
   - CORS configuration

## Performance Considerations

1. **Frontend Optimization**
   - Server-side rendering
   - Code splitting
   - Image optimization

2. **Database Optimization**
   - Indexed queries
   - Efficient joins
   - Caching strategy

3. **API Performance**
   - Response compression
   - Query optimization
   - Connection pooling 

4. **Things to later delete**
   - Supabase PW: e*CS?qP#k3L&9Kq