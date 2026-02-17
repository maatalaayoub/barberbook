import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized', role: null },
        { status: 401 }
      );
    }

    // Initialize Supabase client
    const supabase = createServerSupabaseClient();

    // Get user from Supabase
    const { data: user, error } = await supabase
      .from('users')
      .select('id, role, email, created_at')
      .eq('clerk_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No user found - no role assigned yet
        return NextResponse.json(
          { role: null, hasRole: false },
          { status: 200 }
        );
      }
      console.error('Error fetching user role:', error);
      return NextResponse.json(
        { error: 'Database error', role: null },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        role: user.role, 
        hasRole: true,
        userId: user.id,
        email: user.email 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error getting role:', error);
    return NextResponse.json(
      { error: 'Internal server error', role: null },
      { status: 500 }
    );
  }
}
