import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });
  
  try {
    const { data: members, error } = await supabase
      .from('team_members')
      .select('*');

    if (error) throw error;

    return NextResponse.json(members);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching members' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  
  try {
    const { name, email, role } = await request.json();

    const { data: member, error } = await supabase
      .from('team_members')
      .insert([{ name, email, role }])
      .select()
      .single();

    if (error) throw error;

    // Send welcome email
    await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: email,
        subject: 'Welcome to the Team!',
        text: `Hi ${name},\n\nWelcome to the team! You've been added as a ${role}.\n\nBest regards,\nYour Manager`,
      }),
    });

    return NextResponse.json(member);
  } catch (error) {
    return NextResponse.json({ error: 'Error creating member' }, { status: 500 });
  }
} 