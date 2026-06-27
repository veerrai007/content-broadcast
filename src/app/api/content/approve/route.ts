import { NextRequest, NextResponse } from 'next/server';
import Content from '@/models/Content';
import Approval from '@/models/Approval';
import { getUserFromRequest } from '@/lib/auth';
import { dbConnect } from '@/lib/db';
import mongoose from 'mongoose';

export async function PATCH(request:NextRequest) {
  try {
    const user:any = getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'principal') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const param = request.nextUrl.searchParams.get('id');
    await dbConnect();

    console.log('content id is' , param?.toString());

    const content = await Content.findByIdAndUpdate(
      { _id: new mongoose.Types.ObjectId(param?.toString()) },
      { status: 'approved', rejectionReason: null },
    );
    if (!content) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    await Approval.create({
      content: param,
      reviewedBy: user.id,
      action: 'approved',
    });

    return NextResponse.json({ content });

  } catch (err) {
    console.log(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}