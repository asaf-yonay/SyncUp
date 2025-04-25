'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import OrgChart from '../components/OrgChart';
import VoiceNavigation from '../components/VoiceNavigation';
import { mockTeamMembers } from '../lib/mockData';

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Team Objectives</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-4">
            <OrgChart members={mockTeamMembers} currentUserId={user.id} />
          </div>
        </div>
      </main>

      <VoiceNavigation 
        teamMembers={mockTeamMembers.map(member => ({ id: member.id, name: member.name }))} 
        onAddActionItem={(memberId, content) => {
          // Handle adding action item
          console.log('Adding action item:', { memberId, content });
        }} 
      />
    </div>
  );
} 