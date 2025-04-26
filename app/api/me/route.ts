import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] Starting /api/me request`);
  
  const supabase = createRouteHandlerClient({ cookies });
  
  try {
    // Get the current user's session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    console.log(`[${timestamp}] Session check:`, {
      hasSession: !!session,
      userId: session?.user?.id,
      error: sessionError?.message
    });
    
    if (sessionError || !session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Get the team member data
    const { data: teamMember, error: teamMemberError } = await supabase
      .from('team_members')
      .select('*')
      .eq('id', session.user.id)
      .single();

    console.log(`[${timestamp}] Team member fetch:`, {
      hasTeamMember: !!teamMember,
      error: teamMemberError?.message,
      data: teamMember
    });

    if (teamMemberError) {
      console.error(`[${timestamp}] Error fetching team member:`, teamMemberError);
      return NextResponse.json({ error: 'Error fetching team member data' }, { status: 500 });
    }

    // Get the user's objectives
    const { data: objectives, error: objectivesError } = await supabase
      .from('objectives')
      .select(`
        *,
        action_items (*)
      `)
      .eq('team_member_id', session.user.id);

    console.log(`[${timestamp}] Objectives fetch:`, {
      count: objectives?.length,
      error: objectivesError?.message,
      data: objectives
    });

    if (objectivesError) {
      console.error(`[${timestamp}] Error fetching objectives:`, objectivesError);
      return NextResponse.json({ error: 'Error fetching objectives' }, { status: 500 });
    }

    // Get team members under the current user (if they're a manager)
    const { data: teamMembers, error: teamMembersError } = await supabase
      .from('team_members')
      .select('*')
      .eq('manager_id', session.user.id);

    console.log(`[${timestamp}] Team members fetch:`, {
      count: teamMembers?.length,
      error: teamMembersError?.message,
      data: teamMembers
    });

    if (teamMembersError) {
      console.error(`[${timestamp}] Error fetching team members:`, teamMembersError);
      return NextResponse.json({ error: 'Error fetching team members' }, { status: 500 });
    }

    // Return the combined data
    const response = {
      teamMember,
      objectives,
      teamMembers
    };

    console.log(`[${timestamp}] Final response:`, response);

    return NextResponse.json(response);

  } catch (error) {
    console.error(`[${timestamp}] Unexpected error:`, error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 