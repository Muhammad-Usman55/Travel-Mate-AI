import { NextResponse, type NextRequest } from 'next/server';

const publicPaths = ['/login', '/register', '/', '/explore', '/api/auth', '/_next', '/favicon'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/ping')) {
    return new Response('pong', { status: 200 });
  }

  const isPublic = publicPaths.some(p => pathname.startsWith(p));
  if (isPublic) return NextResponse.next();

  const isAuthenticated = request.cookies.has('django-session');

  if (!isAuthenticated && (
    pathname.startsWith('/chat') ||
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/trip')
  )) {
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|poster).*)'],
};
