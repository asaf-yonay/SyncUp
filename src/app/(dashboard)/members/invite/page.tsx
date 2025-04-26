import { Suspense } from 'react'
import { InviteForm } from '@/components/members/InviteForm'
import { RoleSelection } from '@/components/members/RoleSelection'
import { EmailTemplate } from '@/components/members/EmailTemplate'

export default function InviteMemberPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Invite Team Member</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <Suspense fallback={<div>Loading invite form...</div>}>
            <InviteForm />
          </Suspense>

          <Suspense fallback={<div>Loading role selection...</div>}>
            <RoleSelection />
          </Suspense>
        </div>

        <Suspense fallback={<div>Loading email template...</div>}>
          <EmailTemplate />
        </Suspense>
      </div>
    </div>
  )
} 