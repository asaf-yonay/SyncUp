# Application Refactoring Plan

## 1. New Directory Structure

```
src/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication routes
│   │   ├── login/         # Login page
│   │   └── layout.tsx     # Auth layout
│   ├── (dashboard)/       # Protected routes
│   │   ├── home/          # Home page
│   │   ├── members/       # Member management
│   │   │   ├── [id]/      # Individual member page
│   │   │   └── invite/    # Invite new member
│   │   └── layout.tsx     # Dashboard layout
│   └── layout.tsx         # Root layout
├── lib/                   # Backend and data layer
│   ├── api/              # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── members/      # Member management endpoints
│   │   ├── objectives/   # Objectives endpoints
│   │   └── action-items/ # Action items endpoints
│   ├── data/            # Data access layer
│   │   ├── auth.ts      # Authentication data
│   │   ├── members.ts   # Member data
│   │   ├── objectives.ts # Objectives data
│   │   └── action-items.ts # Action items data
│   └── types/           # TypeScript types
├── components/          # Reusable components
│   ├── auth/           # Auth-related components
│   ├── dashboard/      # Dashboard components
│   ├── members/        # Member-related components
│   └── shared/         # Shared components
├── hooks/              # Custom hooks
└── contexts/           # React contexts
```

## 2. Route Consolidation

### Single Route File (`src/app/route.ts`)
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(request: NextRequest) {
  // Handle authentication
  // Route protection
  // Session management
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

## 3. Page Components

### Home Page (`src/app/(dashboard)/home/page.tsx`)
- Dashboard overview
- Recent activity
- Quick actions

### Member Management (`src/app/(dashboard)/members/page.tsx`)
- Team member list
- Search and filter
- Bulk actions

### Individual Member (`src/app/(dashboard)/members/[id]/page.tsx`)
- Member details
- Objectives list
- Performance metrics

### Invite Member (`src/app/(dashboard)/members/invite/page.tsx`)
- Invite form
- Role selection
- Email template

### Login Page (`src/app/(auth)/login/page.tsx`)
- Login form
- OAuth buttons
- Error handling

## 4. Backend Organization

### API Layer (`src/lib/api/`)
```typescript
// Example: members.ts
export async function getMembers() {
  // Member fetching logic
}

export async function createMember(data: MemberData) {
  // Member creation logic
}

export async function updateMember(id: string, data: Partial<MemberData>) {
  // Member update logic
}
```

### Data Layer (`src/lib/data/`)
```typescript
// Example: members.ts
import { supabase } from './client';

export const members = {
  async getAll() {
    // Supabase query
  },
  async getById(id: string) {
    // Supabase query
  },
  async create(data: MemberData) {
    // Supabase mutation
  }
};
```

## 5. Migration Steps

1. **Setup New Structure**
   - Create new directory structure
   - Move existing files to new locations
   - Update imports

2. **Consolidate Routes**
   - Create single route file
   - Move middleware logic
   - Update route protection

3. **Create Page Components**
   - Implement new page layouts
   - Move existing UI to new structure
   - Add new features

4. **Organize Backend**
   - Create API layer
   - Implement data layer
   - Move Supabase queries

5. **Update Components**
   - Reorganize components
   - Create new shared components
   - Update imports

6. **Testing**
   - Test all routes
   - Verify authentication
   - Check data flow

## 6. Benefits

1. **Improved Organization**
   - Clear separation of concerns
   - Better code maintainability
   - Easier navigation

2. **Enhanced Scalability**
   - Modular structure
   - Reusable components
   - Clear data flow

3. **Better Development Experience**
   - Consistent patterns
   - Clear file locations
   - Easier debugging

4. **Performance Optimization**
   - Optimized route handling
   - Better code splitting
   - Improved caching

## 7. Potential Challenges

1. **Migration Complexity**
   - Need to update all imports
   - Potential breaking changes
   - Testing requirements

2. **State Management**
   - Context updates
   - Data flow changes
   - Cache invalidation

3. **Authentication Flow**
   - Route protection updates
   - Session management
   - OAuth handling

## 8. Next Steps

1. Review and approve plan
2. Create backup of current code
3. Begin migration process
4. Test each component
5. Deploy changes incrementally

Would you like to proceed with this refactoring plan? We can adjust any part of it before starting the implementation. 