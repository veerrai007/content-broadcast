import { AuthUser } from '@/types';
import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const SECRET = process.env.JWT_SECRET || '';

export function signToken(payload: AuthUser):string {
  return jwt.sign(payload, SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): AuthUser | null  {
  try {
    return jwt.verify(token, SECRET) as AuthUser;
  } catch {
    return null;
  }
}

export function getTokenFromRequest(request: NextRequest) {
  const auth = request.headers.get('authorization');
  if (!auth || !auth.startsWith('Bearer ')) return null;
  return auth.split(' ')[1];
}

export function getUserFromRequest(request: NextRequest) {
  const token = getTokenFromRequest(request);
  if (!token) return null;
  return verifyToken(token);
}
