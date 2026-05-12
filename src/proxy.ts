import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

const TEACHER_ROUTES = ['/teacher'];
const PRINCIPAL_ROUTES = ['/principal'];
const AUTH_ROUTES = ['/login', '/register'];

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const token =
        request.cookies.get('token')?.value ||
        request.headers.get('authorization')?.split(' ')[1];

    const decoded = token ? verifyToken(token) : null;

    if (AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
        if (decoded) {
            if (decoded.role === 'teacher') {
                return NextResponse.redirect(new URL('/teacher/dashboard', request.url));
            }
            if (decoded.role === 'principal') {
                return NextResponse.redirect(new URL('/principal/dashboard', request.url));
            }
        }
        return NextResponse.next();
    }

    const isProtected =
        TEACHER_ROUTES.some((r) => pathname.startsWith(r)) ||
        PRINCIPAL_ROUTES.some((r) => pathname.startsWith(r));

    if (isProtected && !decoded) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (TEACHER_ROUTES.some((r) => pathname.startsWith(r)) && decoded?.role !== 'teacher') {
        return NextResponse.redirect(new URL('/principal/dashboard', request.url));
    }

    if (PRINCIPAL_ROUTES.some((r) => pathname.startsWith(r)) && decoded?.role !== 'principal') {
        return NextResponse.redirect(new URL('/teacher/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/teacher/:path*',
        '/principal/:path*',
        '/login',
        '/register',
        '/'
    ],
};