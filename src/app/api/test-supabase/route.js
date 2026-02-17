import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    console.log('[test-supabase] Testing Supabase connection...');
    
    // Check environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    console.log('[test-supabase] URL:', supabaseUrl ? 'Set' : 'MISSING');
    console.log('[test-supabase] Service Key:', supabaseServiceKey ? 'Set (length: ' + supabaseServiceKey.length + ')' : 'MISSING');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({
        success: false,
        error: 'Missing environment variables',
        details: {
          hasUrl: !!supabaseUrl,
          hasServiceKey: !!supabaseServiceKey
        }
      }, { status: 500 });
    }

    const supabase = createServerSupabaseClient();

    // Test 1: Check if we can read from the users table
    console.log('[test-supabase] Reading users table...');
    const { data: users, error: readError } = await supabase
      .from('users')
      .select('*')
      .limit(5);

    if (readError) {
      console.log('[test-supabase] Read error:', readError);
      return NextResponse.json({
        success: false,
        test: 'read',
        error: readError.message,
        code: readError.code
      }, { status: 500 });
    }

    console.log('[test-supabase] Found', users?.length || 0, 'users');

    // Test 2: Try a test insert (will be rolled back)
    const testClerkId = 'test_' + Date.now();
    console.log('[test-supabase] Testing insert with clerk_id:', testClerkId);
    
    const { data: insertedUser, error: insertError } = await supabase
      .from('users')
      .insert({
        clerk_id: testClerkId,
        email: 'test@test.com',
        role: 'user'
      })
      .select()
      .single();

    if (insertError) {
      console.log('[test-supabase] Insert error:', insertError);
      return NextResponse.json({
        success: false,
        test: 'insert',
        error: insertError.message,
        code: insertError.code,
        hint: insertError.hint,
        existingUsers: users?.length || 0
      }, { status: 500 });
    }

    console.log('[test-supabase] Insert successful:', insertedUser);

    // Clean up the test user
    const { error: deleteError } = await supabase
      .from('users')
      .delete()
      .eq('clerk_id', testClerkId);

    if (deleteError) {
      console.log('[test-supabase] Delete error (cleanup):', deleteError);
    }

    return NextResponse.json({
      success: true,
      message: 'Supabase connection working correctly',
      canRead: true,
      canInsert: true,
      existingUsers: users?.length || 0,
      testInsertId: insertedUser.id
    });

  } catch (error) {
    console.error('[test-supabase] Unexpected error:', error);
    return NextResponse.json({
      success: false,
      error: 'Unexpected error',
      message: error.message
    }, { status: 500 });
  }
}
