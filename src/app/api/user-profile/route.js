import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

// GET - Fetch user profile data based on role
export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const supabase = createServerSupabaseClient();

    // Get user from users table including role
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, username, role')
      .eq('clerk_id', userId)
      .single();

    if (userError && userError.code !== 'PGRST116') {
      console.error('[user-profile] Error fetching user:', userError);
      return NextResponse.json(
        { error: 'Failed to fetch user' },
        { status: 500 }
      );
    }

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Fetch from appropriate table based on role (including first_name, last_name)
    const profileTable = user.role === 'business' ? 'business_profile' : 'user_profile';
    
    const { data: profile, error: profileError } = await supabase
      .from(profileTable)
      .select('first_name, last_name, birthday, gender, phone, address, city')
      .eq('user_id', user.id)
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
      console.error('[user-profile] Error fetching profile:', profileError);
    }

    return NextResponse.json({
      firstName: profile?.first_name || null,
      lastName: profile?.last_name || null,
      username: user.username,
      role: user.role,
      birthday: profile?.birthday || null,
      gender: profile?.gender || null,
      phone: profile?.phone || null,
      address: profile?.address || null,
      city: profile?.city || null,
    });
  } catch (error) {
    console.error('[user-profile] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update user profile data based on role
export async function PUT(request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { firstName, lastName, birthday, gender } = body;

    const supabase = createServerSupabaseClient();

    // Get user from users table including role
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, role')
      .eq('clerk_id', userId)
      .single();

    if (userError || !user) {
      console.error('[user-profile] Error fetching user:', userError);
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const profileTable = user.role === 'business' ? 'business_profile' : 'user_profile';

    // Check if profile exists
    const { data: existingProfile, error: profileCheckError } = await supabase
      .from(profileTable)
      .select('id')
      .eq('user_id', user.id)
      .single();

    // Build profile update data (first_name, last_name, birthday, gender all go to profile table)
    const profileData = {};
    if (firstName !== undefined) profileData.first_name = firstName;
    if (lastName !== undefined) profileData.last_name = lastName;
    if (birthday !== undefined) profileData.birthday = birthday || null;
    if (gender !== undefined) profileData.gender = gender || null;

    if (Object.keys(profileData).length > 0) {
      if (existingProfile) {
        // Update existing profile
        const { error: updateProfileError } = await supabase
          .from(profileTable)
          .update(profileData)
          .eq('user_id', user.id);

        if (updateProfileError) {
          console.error('[user-profile] Error updating profile:', updateProfileError);
          return NextResponse.json(
            { error: 'Failed to update profile' },
            { status: 500 }
          );
        }
      } else {
        // Create new profile
        const { error: createProfileError } = await supabase
          .from(profileTable)
          .insert({
            user_id: user.id,
            ...profileData,
          });

        if (createProfileError) {
          console.error('[user-profile] Error creating profile:', createProfileError);
          return NextResponse.json(
            { error: 'Failed to create profile' },
            { status: 500 }
          );
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[user-profile] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
