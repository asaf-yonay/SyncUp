# Database Schema

## Tables

### 1. User
```sql
CREATE TABLE "User" (
  "id" TEXT NOT NULL,
  "name" TEXT,
  "email" TEXT NOT NULL,
  "emailVerified" TIMESTAMP(3),
  "image" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
```

### 2. Team
```sql
CREATE TABLE "Team" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "ownerId" TEXT NOT NULL,
  CONSTRAINT "Team_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Team_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE
);
```

### 3. TeamMember
```sql
CREATE TABLE "TeamMember" (
  "id" TEXT NOT NULL,
  "role" TEXT NOT NULL DEFAULT 'member',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "teamId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  CONSTRAINT "TeamMember_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "TeamMember_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE,
  CONSTRAINT "TeamMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);
```

### 4. ActionItem
```sql
CREATE TABLE "ActionItem" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "status" TEXT NOT NULL DEFAULT 'pending',
  "priority" TEXT NOT NULL DEFAULT 'medium',
  "dueDate" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "teamId" TEXT NOT NULL,
  "assignedToId" TEXT,
  "createdById" TEXT NOT NULL,
  CONSTRAINT "ActionItem_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "ActionItem_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE,
  CONSTRAINT "ActionItem_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "TeamMember"("id") ON DELETE SET NULL,
  CONSTRAINT "ActionItem_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "TeamMember"("id") ON DELETE CASCADE
);
```

### 5. Session
```sql
CREATE TABLE "Session" (
  "id" TEXT NOT NULL,
  "sessionToken" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "expires" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Session_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);
```

### 6. Account
```sql
CREATE TABLE "Account" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "provider" TEXT NOT NULL,
  "providerAccountId" TEXT NOT NULL,
  "refresh_token" TEXT,
  "access_token" TEXT,
  "expires_at" INTEGER,
  "token_type" TEXT,
  "scope" TEXT,
  "id_token" TEXT,
  "session_state" TEXT,
  CONSTRAINT "Account_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);
```

## Indexes

### User
```sql
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
```

### TeamMember
```sql
CREATE UNIQUE INDEX "TeamMember_teamId_userId_key" ON "TeamMember"("teamId", "userId");
```

### Session
```sql
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");
```

### Account
```sql
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");
```

## Relationships

### 1. User Relationships
- One-to-Many with Team (owner)
- One-to-Many with TeamMember
- One-to-Many with Session
- One-to-Many with Account

### 2. Team Relationships
- Many-to-One with User (owner)
- One-to-Many with TeamMember
- One-to-Many with ActionItem

### 3. TeamMember Relationships
- Many-to-One with Team
- Many-to-One with User
- One-to-Many with ActionItem (assigned)
- One-to-Many with ActionItem (created)

### 4. ActionItem Relationships
- Many-to-One with Team
- Many-to-One with TeamMember (assigned)
- Many-to-One with TeamMember (created)

## Enums

### 1. TeamMemberRole
```typescript
enum TeamMemberRole {
  owner = 'owner',
  admin = 'admin',
  member = 'member'
}
```

### 2. ActionItemStatus
```typescript
enum ActionItemStatus {
  pending = 'pending',
  in_progress = 'in_progress',
  completed = 'completed',
  cancelled = 'cancelled'
}
```

### 3. ActionItemPriority
```typescript
enum ActionItemPriority {
  low = 'low',
  medium = 'medium',
  high = 'high',
  urgent = 'urgent'
}
```

## Prisma Schema

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  teams         Team[]    @relation("TeamOwner")
  memberships   TeamMember[]
  sessions      Session[]
  accounts      Account[]
}

model Team {
  id          String       @id @default(cuid())
  name        String
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
  owner       User         @relation("TeamOwner", fields: [ownerId], references: [id])
  ownerId     String
  members     TeamMember[]
  actionItems ActionItem[]
}

model TeamMember {
  id          String      @id @default(cuid())
  role        String      @default("member")
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  team        Team        @relation(fields: [teamId], references: [id])
  teamId      String
  user        User        @relation(fields: [userId], references: [id])
  userId      String
  assigned    ActionItem[] @relation("AssignedTo")
  created     ActionItem[] @relation("CreatedBy")

  @@unique([teamId, userId])
}

model ActionItem {
  id          String      @id @default(cuid())
  title       String
  description String?
  status      String      @default("pending")
  priority    String      @default("medium")
  dueDate     DateTime?
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  team        Team        @relation(fields: [teamId], references: [id])
  teamId      String
  assignedTo  TeamMember? @relation("AssignedTo", fields: [assignedToId], references: [id])
  assignedToId String?
  createdBy   TeamMember  @relation("CreatedBy", fields: [createdById], references: [id])
  createdById String
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id])
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?
  user              User    @relation(fields: [userId], references: [id])

  @@unique([provider, providerAccountId])
}
```

## Data Validation

### 1. User
- Email must be unique and valid
- Name is optional
- Image URL must be valid if provided

### 2. Team
- Name is required
- Owner must exist
- Created and updated timestamps are auto-managed

### 3. TeamMember
- Role must be one of: owner, admin, member
- User can only be a member once per team
- Team must exist
- User must exist

### 4. ActionItem
- Title is required
- Status must be one of: pending, in_progress, completed, cancelled
- Priority must be one of: low, medium, high, urgent
- Team must exist
- Assigned member must exist if provided
- Created by member must exist

## Data Types

### 1. Text Fields
- id: CUID (Collision-resistant Unique IDentifier)
- name: VARCHAR(255)
- email: VARCHAR(255)
- role: VARCHAR(50)
- status: VARCHAR(50)
- priority: VARCHAR(50)

### 2. Date Fields
- createdAt: TIMESTAMP
- updatedAt: TIMESTAMP
- dueDate: TIMESTAMP
- emailVerified: TIMESTAMP
- expires: TIMESTAMP

### 3. Relationship Fields
- ownerId: TEXT
- teamId: TEXT
- userId: TEXT
- assignedToId: TEXT
- createdById: TEXT
``` 