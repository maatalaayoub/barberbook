import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

const VALID_ROLES = ['user', 'barber'];

export async function POST(request) {
  console.log('[set-role] API called');
  
  try {
    const { userId } = await auth();
    console.log('[set-role] Clerk userId:', userId);
    
    if (!userId) {
      console.log('[set-role] No userId, returning 401');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { role } = body;
    console.log('[set-role] Requested role:', role);

    // Validate role
    if (!role || !VALID_ROLES.includes(role)) {
      console.log('[set-role] Invalid role');
      return NextResponse.json(
        { error: 'Invalid role. Must be "user" or "barber"' },
        { status: 400 }
      );
    }

    // Get current user email from Clerk
    const user = await currentUser();
    const email = user?.emailAddresses?.[0]?.emailAddress || null;
    console.log('[set-role] User email:', email);

    // Initialize Supabase client
    console.log('[set-role] Creating Supabase client...');
    console.log('[set-role] SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'MISSING');
    console.log('[set-role] SERVICE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Set (length: ' + process.env.SUPABASE_SERVICE_ROLE_KEY.length + ')' : 'MISSING');
    
    let supabase;
    try {
      supabase = createServerSupabaseClient();
      console.log('[set-role] Supabase client created successfully');
    } catch (err) {
      console.error('[set-role] Failed to create Supabase client:', err);
      return NextResponse.json(
        { error: 'Failed to create database client', details: err.message },
        { status: 500 }
      );
    }

    // Check if user already exists in Supabase
    console.log('[set-role] Checking if user exists...');
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('id, role')
      .eq('clerk_id', userId)
      .single();

    console.log('[set-role] Existing user check:', { existingUser, fetchError });

    if (fetchError && fetchError.code !== 'PGRST116') {
      // PGRST116 = no rows returned, which is ok for new users
      console.error('[set-role] Error fetching user:', fetchError);
      return NextResponse.json(
        { error: 'Database error', details: fetchError.message },
        { status: 500 }
      );
    }

    // SECURITY: Prevent role switching after initial assignment
    if (existingUser) {
      console.log('[set-role] User already exists with role:', existingUser.role);
      return NextResponse.json(
        { error: 'Role already assigned. Role cannot be changed.', role: existingUser.role },
        { status: 403 }
      );
    }

    // Create new user in Supabase with role
    console.log('[set-role] Creating new user in Supabase...');
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert({
        clerk_id: userId,
        email: email,
        role: role,
      })
      .select()
      .single();

    console.log('[set-role] Insert result:', { newUser, insertError });

    if (insertError) {
      console.error('[set-role] Error creating user:', insertError);
      console.error('[set-role] Insert error details:', {
        message: insertError.message,
        code: insertError.code,
        hint: insertError.hint,
        details: insertError.details
      });
      return NextResponse.json(
        { 
          error: 'Failed to create user', 
          details: insertError.message,
          code: insertError.code,
          hint: insertError.hint
        },
        { status: 500 }
      );
    }

    console.log('[set-role] User created successfully:', newUser);
    return NextResponse.json(
      { success: true, role: newUser.role, userId: newUser.id },
      { status: 200 }
    );
  } catch (error) {
    console.error('[set-role] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// GET method to retrieve current role
export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const role = user.publicMetadata?.role || null;

    return NextResponse.json({ role }, { status: 200 });
  } catch (error) {
    console.error('Error getting role:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
