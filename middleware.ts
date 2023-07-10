import { DHI_SESSION, PAGE_PATH } from '@utils';
import { jwtVerify } from 'jose';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const hasSession = request.cookies.has(DHI_SESSION);
  if (!hasSession)
    return NextResponse.redirect(new URL(PAGE_PATH.login, request.url));

  if (request.nextUrl.pathname === PAGE_PATH.home)
    return NextResponse.redirect(new URL(PAGE_PATH.calendar, request.url));

  const session = request.cookies.get(DHI_SESSION);
  const accessToken = session
    ? JSON.parse(session?.value).access_token
    : undefined;
  const secret = new TextEncoder().encode(
    process.env.NEXT_PUBLIC_DIRECTUS_SECRET_TOKEN
  );
  try {
    await jwtVerify(accessToken, secret);
    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL(PAGE_PATH.login, request.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - login (Login page)
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!login|api|_next/static|_next/image|favicon.ico).*)',
  ],
};
