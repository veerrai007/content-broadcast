import { NextRequest, NextResponse } from 'next/server';
import Content from '@/models/Content';
import { getUserFromRequest } from '@/lib/auth';
import { dbConnect } from '@/lib/db';
import '@/models/User';

export async function GET(request:NextRequest, { params }:any) {
  try {
    const user = getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    const content = await Content.findById(params.id).populate('uploadedBy', 'name email');
    if (!content) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    return NextResponse.json({ content });

  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(request:NextRequest, { params }:any) {
  try {
    const user:any = getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    const content = await Content.findById(params.id);
    if (!content) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    if (content.uploadedBy.toString() !== user.id ) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await content.deleteOne();
    return NextResponse.json({ message: 'Deleted successfully' });

  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}