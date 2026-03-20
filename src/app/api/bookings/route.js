import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

/**
 * GET /api/bookings
 * Fetch all appointments for the currently signed-in user.
 * Returns appointments with business info (name, avatar, accent color).
 */
export async function GET() {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createServerSupabaseClient();

    const { data: appointments, error } = await supabase
      .from('appointments')
      .select(`
        id, service, price, start_time, end_time, status, notes, client_name,
        business_info_id,
        business_info (
          id,
          business_category,
          professional_type,
          shop_salon_info ( business_name, phone ),
          mobile_service_info ( business_name, phone ),
          business_card_settings ( settings )
        )
      `)
      .eq('clerk_id', clerkId)
      .order('start_time', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const results = (appointments || []).map(apt => {
      const biz = apt.business_info;
      const details = biz?.shop_salon_info || biz?.mobile_service_info;
      const settings = biz?.business_card_settings?.settings || {};

      return {
        id: apt.id,
        service: apt.service,
        price: apt.price,
        startTime: apt.start_time,
        endTime: apt.end_time,
        status: apt.status,
        notes: apt.notes,
        clientName: apt.client_name,
        businessId: apt.business_info_id,
        businessName: settings.businessName || details?.business_name || '',
        businessPhone: details?.phone || null,
        avatarUrl: settings.avatarUrl || null,
        accentColor: settings.accentColor || 'slate',
        professionalType: biz?.professional_type || '',
      };
    });

    return NextResponse.json({ bookings: results });
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
