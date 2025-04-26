import { NextResponse } from 'next/server';
import { ActionItem } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, dueDate, priority, memberId } = body;

    // Validate required fields
    if (!title || !description || !dueDate || !priority || !memberId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create action item in the database
    const actionItem: ActionItem = {
      id: crypto.randomUUID(),
      title,
      description,
      dueDate,
      priority,
      memberId,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // TODO: Save to database
    // For now, we'll just return the created action item
    return NextResponse.json(actionItem, { status: 201 });
  } catch (error) {
    console.error('Error creating action item:', error);
    return NextResponse.json(
      { error: 'Failed to create action item' },
      { status: 500 }
    );
  }
} 