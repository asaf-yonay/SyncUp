# Architecture Overview

## Tech Stack

- **Frontend**: Next.js with TypeScript
- **Styling**: Tailwind CSS
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