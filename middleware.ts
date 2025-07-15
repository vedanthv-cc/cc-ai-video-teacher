import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Skip middleware for access page and API routes
  if (request.nextUrl.pathname === '/access' || request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Check if user has access
  const hasAccess = request.cookies.get('hasAccess')?.value === 'true';
  
  if (!hasAccess) {
    return NextResponse.redirect(new URL('/access', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 