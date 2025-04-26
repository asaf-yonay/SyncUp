import { NextResponse } from 'next/server';
import { mockObjectives } from '../../../../../lib/mockData';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const objectives = mockObjectives.filter(obj => obj.team_member_id === params.id);
    return NextResponse.json(objectives);
  } catch (error) {
    console.error('Error fetching objectives:', error);
    return NextResponse.json(
      { error: 'Error fetching objectives' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { title, description, status, dueDate } = await request.json();
    
    const newObjective = {
      id: String(mockObjectives.length + 1),
      title,
      description,
      status,
      due_date: dueDate,
      team_member_id: params.id,
      action_items: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // In a real app, we would save this to a database
    // For now, we'll just return the new objective
    return NextResponse.json(newObjective);
  } catch (error) {
    console.error('Error creating objective:', error);
    return NextResponse.json(
      { error: 'Error creating objective' },
      { status: 500 }
    );
  }
} 