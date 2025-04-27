# Architecture Overview

## Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: CSS Modules + CSS Variables
- **State Management**: React Context + Custom Hooks
- **Authentication**: NextAuth.js
- **Voice Recognition**: Web Speech API

### Backend
- **Framework**: Next.js API Routes
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **API**: RESTful endpoints

### Infrastructure
- **Hosting**: Vercel
- **Database**: Supabase
- **Storage**: Supabase Storage
- **CI/CD**: GitHub Actions

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── (auth)/           # Authentication routes
│   └── (dashboard)/      # Dashboard routes
├── components/            # React components
│   ├── dashboard/        # Dashboard components
│   ├── members/          # Member management components
│   └── shared/           # Shared components
├── lib/                  # Utility functions
├── styles/              # Global styles
└── types/               # TypeScript types
```

## Component Architecture

### 1. Layout Components
- `RootLayout`: Main application layout
- `DashboardLayout`: Dashboard-specific layout
- `AuthLayout`: Authentication pages layout

### 2. Shared Components
- `PersistentVoiceNavigation`: Voice command interface
- `VoiceNavigation`: Voice recognition component
- `ActionItemForm`: Action item creation/editing
- `TeamMemberList`: Team member management

### 3. Dashboard Components
- `ActionItems`: Action item list and management
- `TeamOverview`: Team statistics and overview
- `MemberActivity`: Member activity tracking

## Data Flow

### 1. Authentication Flow
```
User -> NextAuth.js -> Session -> Context -> Components
```

### 2. Action Item Flow
```
Voice/Form -> API Route -> Prisma -> Database -> UI Update
```

### 3. Team Management Flow
```
User Action -> API Route -> Prisma -> Database -> UI Update
```

## State Management

### 1. Authentication State
- Managed by NextAuth.js
- Accessed via `useSession` hook
- Protected routes using middleware

### 2. Application State
- Team data via `useTeam` hook
- Action items via `useActionItems` hook
- Member data via `useMembers` hook

### 3. UI State
- Local component state with `useState`
- Form state with controlled components
- Loading states with custom hooks

## API Architecture

### 1. RESTful Endpoints
```
GET    /api/teams          # List teams
POST   /api/teams          # Create team
GET    /api/teams/:id      # Get team
PUT    /api/teams/:id      # Update team
DELETE /api/teams/:id      # Delete team

GET    /api/members        # List members
POST   /api/members        # Add member
PUT    /api/members/:id    # Update member
DELETE /api/members/:id    # Remove member

GET    /api/action-items   # List items
POST   /api/action-items   # Create item
PUT    /api/action-items/:id # Update item
DELETE /api/action-items/:id # Delete item
```

### 2. Authentication Endpoints
```
GET    /api/auth/signin    # Sign in
POST   /api/auth/signout   # Sign out
GET    /api/auth/session   # Get session
```

## Database Schema

See `db_schema.md` for detailed database structure.

## Security

### 1. Authentication
- OAuth with Google
- Session management
- Protected routes
- API route protection

### 2. Data Protection
- Input validation
- SQL injection prevention
- XSS protection
- CSRF protection

### 3. API Security
- Rate limiting
- Request validation
- Error handling
- Logging

## Performance

### 1. Frontend Optimization
- Code splitting
- Lazy loading
- Image optimization
- CSS optimization

### 2. Backend Optimization
- Database indexing
- Query optimization
- Caching strategy
- API optimization

### 3. Build Optimization
- Tree shaking
- Minification
- Compression
- Cache headers

## Testing Strategy

### 1. Unit Tests
- Component tests
- Hook tests
- Utility function tests

### 2. Integration Tests
- API route tests
- Database interaction tests
- Authentication flow tests

### 3. E2E Tests
- User flow tests
- Voice command tests
- Team management tests

## Deployment

### 1. CI/CD Pipeline
- GitHub Actions workflow
- Automated testing
- Build verification
- Deployment checks

### 2. Environment Setup
- Development
- Staging
- Production

### 3. Monitoring
- Error tracking
- Performance monitoring
- User analytics
- Voice command analytics 