import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import Content from '@/models/Content';
import { dbConnect } from '@/lib/db';
import cloudinary from '@/lib/cloudinary';
import { AuthUser } from '@/types';

type QuaryType = {
  status?:string
  title?:any
  uploadedBy?:string
}

export async function GET(request: NextRequest) {
  try {
    const user: AuthUser | null = getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    let query:QuaryType = {};

    if (user.role === 'teacher') query.uploadedBy = user.id;
    if (status) query.status = status;
    if (search) query.title = { $regex: search, $options: 'i' };

    const contents = await Content.find(query)
      .populate('uploadedBy', 'name email')
      .sort({ createdAt: -1 });

    return NextResponse.json({ contents });

  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: NextRequest) {
  try {

    const user: AuthUser | null = getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'teacher') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    await dbConnect();

    const formData = await request.formData();

    const file: any = formData.get('file');
    const title = formData.get('title');
    const subject = formData.get('subject');
    const description = formData.get('description');
    const startTime: string = formData.get('startTime')?.toString() || '';
    const endTime: string = formData.get('endTime')?.toString() || '';
    const rotationDuration = formData.get('rotationDuration');

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Only JPG, PNG, GIF allowed' }, { status: 400 });
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File must be under 10MB' }, { status: 400 });
    }
    if (!title || !subject || !startTime || !endTime) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    if (new Date(endTime) <= new Date(startTime)) {
      return NextResponse.json({ error: 'End time must be after start time' }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();

    const base64 = Buffer.from(buffer).toString('base64');
    const dataUri = `data:${file.type};base64,${base64}`;

    const fileUrl = await cloudinary.uploader.upload(dataUri, {
      folder: 'content-broadcasting',
    });

    const content = await Content.create({
      title, subject, description, fileUrl: fileUrl.url,
      startTime: new Date(startTime), endTime: new Date(endTime), rotationDuration,
      uploadedBy: user.id,
    });

    return NextResponse.json({ content }, { status: 201 });

  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
