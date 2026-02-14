import { clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

const VALID_ROLES = ['user', 'barber'];

export async function POST(request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { role } = body;

    // Validate role
    if (!role || !VALID_ROLES.includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be "user" or "barber"' },
        { status: 400 }
      );
    }

    // Get current user to check if role already exists
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    
    // SECURITY: Prevent role switching after initial assignment
    if (user.publicMetadata?.role) {
      return NextResponse.json(
        { error: 'Role already assigned. Role cannot be changed.' },
        { status: 403 }
      );
    }

    // Set the role in publicMetadata
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: role,
        roleAssignedAt: new Date().toISOString(),
      },
    });

    return NextResponse.json(
      { success: true, role },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error setting role:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
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
