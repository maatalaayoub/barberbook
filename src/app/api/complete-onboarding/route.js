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
      console.log('[complete-onboarding] Bearer token verification failed:', err.message);
    }
  }
  return null;
}

// POST - Mark onboarding as completed
export async function POST(request) {
  try {
    const userId = await getUserId(request);
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const supabase = createServerSupabaseClient();

    // Update onboarding_completed to true
    const { data, error } = await supabase
      .from('users')
      .update({ onboarding_completed: true })
      .eq('clerk_id', userId)
      .select('id, role, onboarding_completed')
      .single();

    if (error) {
      console.error('[complete-onboarding] Error:', error);
      return NextResponse.json(
        { error: 'Failed to update onboarding status', details: error.message },
        { status: 500 }
      );
    }

    console.log('[complete-onboarding] User onboarding completed:', data);
    return NextResponse.json({ success: true, user: data });
  } catch (error) {
    console.error('[complete-onboarding] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// GET - Check onboarding status
export async function GET(request) {
  try {
    const userId = await getUserId(request);
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const supabase = createServerSupabaseClient();

    const { data, error } = await supabase
      .from('users')
      .select('onboarding_completed')
      .eq('clerk_id', userId)
      .single();

    if (error) {
      console.error('[complete-onboarding] Error:', error);
      return NextResponse.json(
        { error: 'Failed to get onboarding status', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      onboarding_completed: data?.onboarding_completed || false 
    });
  } catch (error) {
    console.error('[complete-onboarding] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
