import { DHI_SESSION, PAGE_PATH, expiresCookie, refreshToken } from '@utils'
import { jwtVerify } from 'jose'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const hasSession = req.cookies.has(DHI_SESSION)
  if (!hasSession)
    return NextResponse.redirect(new URL(PAGE_PATH.login, req.url))

  if (req.nextUrl.pathname === PAGE_PATH.home)
    return NextResponse.redirect(new URL(PAGE_PATH.calendar, req.url))

  const session = req.cookies.get(DHI_SESSION)
  const sessionInfo = session ? JSON.parse(session?.value) : undefined
  const access_token = sessionInfo.access_token
  const secret = new TextEncoder().encode(
    process.env.NEXT_PUBLIC_DIRECTUS_SECRET_TOKEN,
  )
  try {
    await jwtVerify(access_token, secret)
    return NextResponse.next()
  } catch (error: any) {
    console.error(error)
    if (error.code === 'ERR_JWT_EXPIRED') {
      const content = await refreshToken(sessionInfo.refresh_token)
      if (content) {
        console.info('Refreshing token...')
        const res = NextResponse.next()
        res.cookies.set(DHI_SESSION, JSON.stringify(content), {
          path: '/',
          expires: expiresCookie(),
        })
        console.info('Refresh token DONE!')
        return res
      }
    }
    return NextResponse.redirect(new URL(PAGE_PATH.login, req.url))
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
}
