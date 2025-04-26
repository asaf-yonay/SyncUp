import { NextResponse } from 'next/server';
import { ActionItem } from '@/lib/types';
import { ActionItemRepository } from '@/lib/data/action-item-repository';

const actionItemRepository = new ActionItemRepository();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, due_date, priority, member_id, objective_id } = body;

    // Validate required fields
    if (!title || !description || !due_date || !priority || !member_id) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create action item using the repository
    const actionItem = await actionItemRepository.create({
      title,
      description,
      due_date,
      priority,
      member_id,
      objective_id: objective_id || null,
      status: 'pending',
      updated_at: new Date().toISOString()
    });

    return NextResponse.json(actionItem, { status: 201 });
  } catch (error) {
    console.error('Error creating action item:', error);
    return NextResponse.json(
      { error: 'Failed to create action item' },
      { status: 500 }
    );
  }
} 