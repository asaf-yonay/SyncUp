import { NextResponse } from 'next/server';
import { mockObjectives } from '../../../../../../lib/mockData';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string; objectiveId: string } }
) {
  try {
    const { status } = await request.json();
    const objectiveIndex = mockObjectives.findIndex(
      obj => obj.id === params.objectiveId && obj.team_member_id === params.id
    );

    if (objectiveIndex === -1) {
      return NextResponse.json(
        { error: 'Objective not found' },
        { status: 404 }
      );
    }

    // Update the objective status
    mockObjectives[objectiveIndex] = {
      ...mockObjectives[objectiveIndex],
      status,
      updated_at: new Date().toISOString()
    };

    return NextResponse.json(mockObjectives[objectiveIndex]);
  } catch (error) {
    console.error('Error updating objective:', error);
    return NextResponse.json(
      { error: 'Error updating objective' },
      { status: 500 }
    );
  }
} 