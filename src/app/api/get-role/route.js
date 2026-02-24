import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

// Helper: get userId either from session or Bearer token
async function getUserId(request) {
  const { userId } = await auth();
  if (userId) return userId;
  
  const authHeader = request.headers.get('Authorization');
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    try {
      const { verifyToken } = await import('@clerk/backend');
      const payload = await verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY,
      });
      if (payload?.sub) return payload.sub;
    } catch (err) {
      console.log('[get-role] Bearer token verification failed:', err.message);
    }
  }
  return null;
}

export async function GET(request) {
  try {
    const userId = await getUserId(request);
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized', role: null },
        { status: 401 }
      );
    }

    // Initialize Supabase client
    let supabase;
    try {
      supabase = createServerSupabaseClient();
    } catch (err) {
      console.error('[get-role] Failed to create Supabase client:', err.message);
      return NextResponse.json(
        { error: 'Database configuration error', role: null },
        { status: 500 }
      );
    }

    // Get user from Supabase
    const { data: user, error } = await supabase
      .from('users')
      .select('id, role, email, onboarding_completed, created_at')
      .eq('clerk_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No user found - no role assigned yet
        return NextResponse.json(
          { role: null, hasRole: false, onboardingCompleted: false },
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
        email: user.email,
        onboardingCompleted: user.onboarding_completed || false
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
