'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function DashboardOverview() {
  return (
    <div style={{
      display: 'grid',
      gap: 'var(--spacing-4)',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))'
    }}>
      <Card>
        <CardHeader style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: 'var(--spacing-2)'
        }}>
          <CardTitle style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)' }}>
            Total Members
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-semibold)' }}>0</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: 'var(--spacing-2)'
        }}>
          <CardTitle style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)' }}>
            Active Objectives
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-semibold)' }}>0</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: 'var(--spacing-2)'
        }}>
          <CardTitle style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)' }}>
            Completed Tasks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-semibold)' }}>0</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: 'var(--spacing-2)'
        }}>
          <CardTitle style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)' }}>
            Team Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-semibold)' }}>0%</div>
        </CardContent>
      </Card>
    </div>
  );
} 