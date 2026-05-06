import { NextRequest, NextResponse } from 'next/server';
import Content from '@/models/Content';
import { dbConnect } from '@/lib/db';

export async function GET(request:NextRequest, { params }:any) {
  try {
    await dbConnect();

    const now = new Date();

    const contents = await Content.find({
      uploadedBy: params.teacherId,
      status: 'approved',
      startTime: { $lte: now },
      endTime: { $gte: now },
    })
    .select('title subject fileUrl startTime endTime rotationDuration')
    .sort({ startTime: 1 });

    return NextResponse.json({ contents });

  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}