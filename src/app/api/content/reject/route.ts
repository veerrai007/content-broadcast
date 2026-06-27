import { NextRequest, NextResponse } from 'next/server';
import Content from '@/models/Content';
import Approval from '@/models/Approval';
import { getUserFromRequest } from '@/lib/auth';
import { dbConnect } from '@/lib/db';
import mongoose from 'mongoose';

export async function PATCH(request:NextRequest, { params }:any) {
  try {
    const user:any = getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'principal') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const param = request.nextUrl.searchParams.get('id');

    console.log('content id is' , param?.toString());

    await dbConnect();

    const { reason } = await request.json();
    if (!reason || !reason.trim()) {
      return NextResponse.json({ error: 'Rejection reason is required' }, { status: 400 });
    }

    const content = await Content.findByIdAndUpdate(
      { _id: new mongoose.Types.ObjectId(param?.toString() || '') },
      { status: 'rejected', rejectionReason: reason },
    );
    if (!content) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    await Approval.create({
      content: param,
      reviewedBy: user.id,
      action: 'rejected',
      reason,
    });

    return NextResponse.json({ content });

  } catch (err) {
    console.log(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}