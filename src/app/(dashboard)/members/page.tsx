import { Suspense } from 'react'
import { TeamMemberList } from '@/components/members/TeamMemberList'
import { SearchAndFilter } from '@/components/members/SearchAndFilter'
import { BulkActions } from '@/components/members/BulkActions'

export default function MembersPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Team Members</h1>
        <BulkActions />
      </div>

      <Suspense fallback={<div>Loading search and filter...</div>}>
        <SearchAndFilter />
      </Suspense>

      <Suspense fallback={<div>Loading team members...</div>}>
        <TeamMemberList />
      </Suspense>
    </div>
  )
} 