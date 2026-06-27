import { NextRequest, NextResponse } from 'next/server';
import Content from '@/models/Content';
import { dbConnect } from '@/lib/db';
import mongoose from 'mongoose';

export async function GET(request:NextRequest) {
  try {
    await dbConnect();

    const now = new Date();

    const param = request.nextUrl.searchParams.get('id');

    const contents = await Content.find({
      uploadedBy: new mongoose.Types.ObjectId(param?.toString()),
      status: 'approved',
      startTime: { $lte: now },
      endTime: { $gte: now },
    })
    .select('title subject fileUrl startTime endTime rotationDuration')
    .sort({ startTime: 1 });

    return NextResponse.json({ contents });

  } catch (err) {
    console.log(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}