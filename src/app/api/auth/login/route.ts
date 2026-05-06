import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

import { signToken } from '@/lib/auth';
import { dbConnect } from '@/lib/db';
import User from '@/models/User';

export async function POST(request:NextRequest) {
  try {
    await dbConnect();
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = signToken({ id: user._id, role: user.role, name: user.name });

    return NextResponse.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });

  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}