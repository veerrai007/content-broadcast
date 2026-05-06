import { NextRequest, NextResponse } from 'next/server';
import { signToken } from '@/lib/auth';
import { dbConnect } from '@/lib/db';
import User from '@/models/User';

export async function POST(request:NextRequest) {
  try {
    await dbConnect();
    const { name, email, password, role, secretCode="" } = await request.json();

    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    if(role=='principal' && secretCode!==process.env.PRINCIPAL_SECRET_CODE){
      return NextResponse.json({ error: 'Principal Secret Code is invalid' }, { status: 401 });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }

    const user = await User.create({ name, email, password, role });

    const token = signToken({ id: user._id, role: user.role, name: user.name });

    return NextResponse.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    }, { status: 201 });

  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}