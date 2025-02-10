import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /, /protected, /api/test)
  const path = request.nextUrl.pathname;

  // Get the query parameters
  const hasNameParam = request.nextUrl.searchParams.has('name');

  // Get token from cookie - Change from 'token' to 'authToken'
  const authToken = request.cookies.get('authToken')?.value;

  // If it's the root path, check authentication
  if (path === '/') {
    if (authToken) {
      return NextResponse.redirect(new URL('/tutorial', request.url));
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Allow public access to /app/[projectName] routes
  if (path.startsWith('/app/') || path === '/agency') {
    return NextResponse.next();
  }

  // Define public paths that don't require authentication
  const publicPaths = ['/login', '/register'];
  
  // If user is not authenticated and trying to access a protected route
  if (!authToken && !publicPaths.includes(path)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If user is authenticated and trying to access login/register
  if (authToken && publicPaths.includes(path)) {
    return NextResponse.redirect(new URL('/tutorial', request.url));
  }

  return NextResponse.next();
}

// Configure which paths the middleware will run on
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