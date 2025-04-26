'use client';

import { useAuth } from '../contexts/AuthContext';
import { useUserData } from '../hooks/useUserData';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Suspense } from 'react'
import { RecentActivity } from '@/components/dashboard/RecentActivity'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { DashboardOverview } from '@/components/dashboard/DashboardOverview'

export default function HomePage() {
  const { user } = useAuth();
  const { data, loading, error } = useUserData();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
  }, [user, router]);

  if (!user) return null;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading...</h1>
          <p className="text-gray-600">Please wait while we fetch your data.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-600">Error</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      <Suspense fallback={<div>Loading overview...</div>}>
        <DashboardOverview />
      </Suspense>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Suspense fallback={<div>Loading recent activity...</div>}>
          <RecentActivity />
        </Suspense>

        <Suspense fallback={<div>Loading quick actions...</div>}>
          <QuickActions />
        </Suspense>
      </div>
    </div>
  );
} 