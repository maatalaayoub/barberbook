import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

// Helper: get userId from session or Bearer token
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
      console.log('[appointments] Bearer verify failed:', err.message);
    }
  }
  return null;
}

// Helper: get business_info_id for the current user
async function getBusinessInfoId(supabase, clerkId) {
  const { data: user } = await supabase
    .from('users')
    .select('id, role')
    .eq('clerk_id', clerkId)
    .single();

  if (!user || user.role !== 'business') return null;

  const { data: businessInfo } = await supabase
    .from('business_info')
    .select('id')
    .eq('user_id', user.id)
    .single();

  return businessInfo?.id || null;
}

// ─── GET: Fetch all appointments for the business ───────────
export async function GET(request) {
  try {
    const clerkId = await getUserId(request);
    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createServerSupabaseClient();
    const businessInfoId = await getBusinessInfoId(supabase, clerkId);
    if (!businessInfoId) {
      // No business profile yet — return empty list instead of 404
      return NextResponse.json({ appointments: [] });
    }

    const { data: appointments, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('business_info_id', businessInfoId)
      .order('start_time', { ascending: true });

    if (error) {
      console.error('[appointments GET] Error:', error);
      return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 });
    }

    return NextResponse.json({ appointments });
  } catch (err) {
    console.error('[appointments GET] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// ─── POST: Create a new appointment ─────────────────────────
export async function POST(request) {
  try {
    const clerkId = await getUserId(request);
    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createServerSupabaseClient();
    const businessInfoId = await getBusinessInfoId(supabase, clerkId);
    if (!businessInfoId) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    const body = await request.json();
    const { client_name, client_phone, service, price, start_time, end_time, status, notes } = body;

    if (!client_name || !service || !start_time || !end_time) {
      return NextResponse.json({ error: 'Missing required fields: client_name, service, start_time, end_time' }, { status: 400 });
    }

    const { data: appointment, error } = await supabase
      .from('appointments')
      .insert({
        business_info_id: businessInfoId,
        client_name,
        client_phone: client_phone || null,
        service,
        price: price ? parseFloat(price) : null,
        start_time,
        end_time,
        status: status || 'confirmed',
        notes: notes || null,
      })
      .select()
      .single();

    if (error) {
      console.error('[appointments POST] Supabase error:', error);
      return NextResponse.json({ error: error.message || 'Failed to create appointment', details: error }, { status: 500 });
    }

    return NextResponse.json({ appointment }, { status: 201 });
  } catch (err) {
    console.error('[appointments POST] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// ─── PUT: Update an existing appointment ────────────────────
export async function PUT(request) {
  try {
    const clerkId = await getUserId(request);
    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createServerSupabaseClient();
    const businessInfoId = await getBusinessInfoId(supabase, clerkId);
    if (!businessInfoId) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    const body = await request.json();
    const { id, ...updateFields } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing appointment id' }, { status: 400 });
    }

    // Only allow updating own appointments
    const { data: appointment, error } = await supabase
      .from('appointments')
      .update(updateFields)
      .eq('id', id)
      .eq('business_info_id', businessInfoId)
      .select()
      .single();

    if (error) {
      console.error('[appointments PUT] Error:', error);
      return NextResponse.json({ error: 'Failed to update appointment' }, { status: 500 });
    }

    return NextResponse.json({ appointment });
  } catch (err) {
    console.error('[appointments PUT] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// ─── DELETE: Remove an appointment ──────────────────────────
export async function DELETE(request) {
  try {
    const clerkId = await getUserId(request);
    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createServerSupabaseClient();
    const businessInfoId = await getBusinessInfoId(supabase, clerkId);
    if (!businessInfoId) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing appointment id' }, { status: 400 });
    }

    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id)
      .eq('business_info_id', businessInfoId);

    if (error) {
      console.error('[appointments DELETE] Error:', error);
      return NextResponse.json({ error: 'Failed to delete appointment' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[appointments DELETE] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
