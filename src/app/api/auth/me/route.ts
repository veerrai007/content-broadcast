import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { dbConnect } from '@/lib/db';
import User from '@/models/User';
import { AuthUser } from '@/types';

export async function GET(request:NextRequest) {
  try {
    const decoded:AuthUser | null = getUserFromRequest(request);
    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user });

  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}