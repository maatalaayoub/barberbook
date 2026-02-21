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

    if (user.role !== 'business') {
      return NextResponse.json({ error: 'Not a business user' }, { status: 403 });
    }

    // Get business info
    const { data: businessInfo } = await supabase
      .from('business_info')
      .select('*')
      .eq('user_id', user.id)
      .single();

    return NextResponse.json({
      onboardingCompleted: businessInfo?.onboarding_completed || false,
      businessInfo: businessInfo || null,
      businessCategory: businessInfo?.business_category || null,
      businessHours: businessInfo?.business_hours || [],
    });
  } catch (error) {
    console.error('[onboarding GET] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Save onboarding data
export async function POST(request) {
  console.log('[onboarding POST] ====== START ======');
  
  try {
    const { userId } = await auth();
    console.log('[onboarding POST] Clerk userId:', userId);
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    console.log('[onboarding POST] Request body:', body);
    const { 
      businessCategory, 
      professionalType, 
      workLocation, 
      businessHours, 
      yearsOfExperience,
      hasCertificate,
      completeOnboarding 
    } = body;

    // Validate required fields
    if (!professionalType) {
      console.error('[onboarding POST] Missing professionalType');
      return NextResponse.json({ error: 'Professional type is required' }, { status: 400 });
    }

    const validProfessionalTypes = ['barber', 'hairdresser', 'stylist', 'colorist', 'other'];
    if (!validProfessionalTypes.includes(professionalType)) {
      console.error('[onboarding POST] Invalid professionalType:', professionalType);
      return NextResponse.json({ 
        error: 'Invalid professional type',
        validTypes: validProfessionalTypes 
      }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();

    // Get user from Supabase
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, role')
      .eq('clerk_id', userId)
      .single();

    console.log('[onboarding POST] User lookup:', { user, userError });

    if (userError || !user) {
      console.error('[onboarding POST] User not found:', userError);
      return NextResponse.json({ error: 'User not found', details: userError?.message }, { status: 404 });
    }

    if (user.role !== 'business') {
      console.error('[onboarding POST] User role is not business:', user.role);
      return NextResponse.json({ error: 'Not a business user', role: user.role }, { status: 403 });
    }

    // Validate business category if provided
    const validBusinessCategories = ['shop_salon_owner', 'mobile_service', 'job_seeker'];
    if (businessCategory && !validBusinessCategories.includes(businessCategory)) {
      console.error('[onboarding POST] Invalid businessCategory:', businessCategory);
      return NextResponse.json({ 
        error: 'Invalid business category',
        validCategories: validBusinessCategories 
      }, { status: 400 });
    }

    // Upsert business info
    const upsertData = {
      user_id: user.id,
      business_category: businessCategory || null,
      professional_type: professionalType,
      onboarding_completed: completeOnboarding || false,
    };

    // Add work location if provided
    if (workLocation) {
      upsertData.work_location = workLocation;
    }

    // Add business hours if provided
    if (businessHours && Array.isArray(businessHours)) {
      upsertData.business_hours = businessHours;
    }

    // Add job seeker specific fields
    if (yearsOfExperience) {
      upsertData.years_of_experience = yearsOfExperience;
    }
    if (hasCertificate !== undefined && hasCertificate !== null) {
      upsertData.has_certificate = hasCertificate;
    }

    console.log('[onboarding POST] Upserting business info:', upsertData);
    
    const { data: upsertResult, error: infoError } = await supabase
      .from('business_info')
      .upsert(upsertData, {
        onConflict: 'user_id',
      })
      .select();

    if (infoError) {
      console.error('[onboarding POST] Business info error:', {
        message: infoError.message,
        code: infoError.code,
        details: infoError.details,
        hint: infoError.hint
      });
      return NextResponse.json({ 
        error: 'Failed to save business info',
        details: infoError.message,
        code: infoError.code,
        hint: infoError.hint
      }, { status: 500 });
    }

    console.log('[onboarding POST] Upsert result:', upsertResult);
    return NextResponse.json({ success: true, data: upsertResult });
  } catch (error) {
    console.error('[onboarding POST] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
