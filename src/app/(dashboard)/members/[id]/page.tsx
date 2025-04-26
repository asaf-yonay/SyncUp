import { Suspense } from 'react'
import { MemberDetails } from '@/components/members/MemberDetails'
import { ObjectivesList } from '@/components/members/ObjectivesList'
import { PerformanceMetrics } from '@/components/members/PerformanceMetrics'

export default function MemberPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <Suspense fallback={<div>Loading member details...</div>}>
        <MemberDetails memberId={params.id} />
      </Suspense>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Suspense fallback={<div>Loading objectives...</div>}>
          <ObjectivesList memberId={params.id} />
        </Suspense>

        <Suspense fallback={<div>Loading performance metrics...</div>}>
          <PerformanceMetrics memberId={params.id} />
        </Suspense>
      </div>
    </div>
  )
} 