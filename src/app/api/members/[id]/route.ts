import { NextResponse } from 'next/server';
import { mockTeamMembers } from '../../../../lib/mockData';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const member = mockTeamMembers.find(m => m.id === params.id);
    
    if (!member) {
      return NextResponse.json(
        { error: 'Member not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(member);
  } catch (error) {
    console.error('Error fetching member:', error);
    return NextResponse.json(
      { error: 'Error fetching member' },
      { status: 500 }
    );
  }
} 