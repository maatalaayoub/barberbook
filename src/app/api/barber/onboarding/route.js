import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

// GET - Check onboarding status and get data
export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createServerSupabaseClient();

    // Get user from Supabase
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, role')
      .eq('clerk_id', userId)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.role !== 'barber') {
      return NextResponse.json({ error: 'Not a barber' }, { status: 403 });
    }

    // Get business info (includes business_hours JSONB)
    const { data: businessInfo } = await supabase
      .from('barber_business_info')
      .select('*')
      .eq('user_id', user.id)
      .single();

    return NextResponse.json({
      onboardingCompleted: businessInfo?.onboarding_completed || false,
      businessInfo: businessInfo || null,
      businessHours: businessInfo?.business_hours || [],
    });
  } catch (error) {
    console.error('[onboarding GET] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Save onboarding data
export async function POST(request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { professionalType, workLocation, businessHours, completeOnboarding } = body;

    const supabase = createServerSupabaseClient();

    // Get user from Supabase
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, role')
      .eq('clerk_id', userId)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.role !== 'barber') {
      return NextResponse.json({ error: 'Not a barber' }, { status: 403 });
    }

    // Upsert business info with business hours in JSONB
    const upsertData = {
      user_id: user.id,
      professional_type: professionalType,
      work_location: workLocation,
      onboarding_completed: completeOnboarding || false,
    };

    // Add business hours if provided
    if (businessHours && Array.isArray(businessHours)) {
      upsertData.business_hours = businessHours;
    }

    const { error: infoError } = await supabase
      .from('barber_business_info')
      .upsert(upsertData, {
        onConflict: 'user_id',
      });

    if (infoError) {
      console.error('[onboarding POST] Business info error:', infoError);
      return NextResponse.json({ error: 'Failed to save business info' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[onboarding POST] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
