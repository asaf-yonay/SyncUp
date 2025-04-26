'use client';

import { useAuth } from '../contexts/AuthContext';
import { useUserData } from '../hooks/useUserData';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
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
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* User Profile Section */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Profile</h2>
          {data?.teamMember && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Name</p>
                <p className="font-semibold">{data.teamMember.name}</p>
              </div>
              <div>
                <p className="text-gray-600">Role</p>
                <p className="font-semibold">{data.teamMember.role}</p>
              </div>
              <div>
                <p className="text-gray-600">Email</p>
                <p className="font-semibold">{data.teamMember.email}</p>
              </div>
            </div>
          )}
        </div>

        {/* Objectives Section */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Objectives</h2>
          {data?.objectives && data.objectives.length > 0 ? (
            <div className="space-y-4">
              {data.objectives.map((objective) => (
                <div key={objective.id} className="border rounded-lg p-4">
                  <h3 className="text-xl font-semibold mb-2">{objective.title}</h3>
                  <p className="text-gray-600 mb-2">{objective.description}</p>
                  <div className="flex justify-between items-center">
                    <span className={`px-2 py-1 rounded ${
                      objective.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {objective.status}
                    </span>
                    <span className="text-gray-500">
                      Due: {new Date(objective.due_date).toLocaleDateString()}
                    </span>
                  </div>
                  {objective.action_items && objective.action_items.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-semibold mb-2">Action Items</h4>
                      <ul className="list-disc list-inside">
                        {objective.action_items.map((item) => (
                          <li key={item.id} className="text-gray-600">
                            {item.content}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No objectives found.</p>
          )}
        </div>

        {/* Team Members Section (for managers) */}
        {data?.teamMembers && data.teamMembers.length > 0 && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Team Members</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.teamMembers.map((member) => (
                <div key={member.id} className="border rounded-lg p-4">
                  <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                  <p className="text-gray-600">{member.role}</p>
                  <p className="text-gray-500 text-sm">{member.email}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 