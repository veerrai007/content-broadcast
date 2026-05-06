import { NextRequest, NextResponse } from 'next/server';
import Content from '@/models/Content';
import Approval from '@/models/Approval';
import { getUserFromRequest } from '@/lib/auth';
import { dbConnect } from '@/lib/db';

export async function PATCH(request:NextRequest, { params }:any) {
  try {
    const user:any = getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'principal') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    await dbConnect();

    const content = await Content.findByIdAndUpdate(
      params.id,
      { status: 'approved', rejectionReason: null },
      { new: true }
    );
    if (!content) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    await Approval.create({
      content: params.id,
      reviewedBy: user.id,
      action: 'approved',
    });

    return NextResponse.json({ content });

  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}