'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import { TeamMember, Objective } from '../../../types';
import VoiceNavigation from '../../../components/VoiceNavigation';

export default function MemberPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { user } = useAuth();
  const [member, setMember] = useState<TeamMember | null>(null);
  const [objectives, setObjectives] = useState<Objective[]>([]);

  useEffect(() => {
    if (!user || !id) return;

    // Fetch member and objectives data
    const fetchData = async () => {
      try {
        const memberResponse = await fetch(`/api/members/${id}`);
        const memberData = await memberResponse.json();
        setMember(memberData);

        const objectivesResponse = await fetch(`/api/members/${id}/objectives`);
        const objectivesData = await objectivesResponse.json();
        setObjectives(objectivesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [id, user]);

  const handleAddObjective = async (title: string, description: string) => {
    try {
      const response = await fetch(`/api/members/${id}/objectives`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          status: 'pending',
          dueDate: new Date().toISOString(),
        }),
      });

      const newObjective = await response.json();
      setObjectives([...objectives, newObjective]);
    } catch (error) {
      console.error('Error adding objective:', error);
    }
  };

  const handleToggleStatus = async (objectiveId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
      const response = await fetch(`/api/members/${id}/objectives/${objectiveId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const updatedObjective = await response.json();
        setObjectives(objectives.map(obj => 
          obj.id === objectiveId ? updatedObjective : obj
        ));
      }
    } catch (error) {
      console.error('Error updating objective status:', error);
    }
  };

  if (!member) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">{member.name}</h1>
          <p className="mt-1 text-sm text-gray-500">{member.role}</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="mt-8">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <div className="px-4 sm:px-0">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Objectives</h3>
                <p className="mt-1 text-sm text-gray-600">
                  Track and manage objectives for this team member.
                </p>
              </div>
            </div>
            
            <div className="shadow sm:rounded-md sm:overflow-hidden">
              <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                {objectives.map((objective) => (
                  <div
                    key={objective.id}
                    className="border-l-4 border-blue-400 bg-blue-50 p-4"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-lg font-medium">{objective.title}</h4>
                        <p className="mt-1 text-sm text-gray-600">{objective.description}</p>
                      </div>
                      <button
                        onClick={() => handleToggleStatus(objective.id, objective.status)}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          objective.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {objective.status === 'completed' ? 'Completed' : 'Mark Complete'}
                      </button>
                    </div>
                    <div className="mt-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        objective.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {objective.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <VoiceNavigation 
        teamMembers={[]} 
        currentMember={member}
        onAddActionItem={(memberId, content) => {
          // Handle adding action item
          console.log('Adding action item:', { memberId, content });
        }} 
      />
    </div>
  );
} 