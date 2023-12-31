import { DHI_SESSION, PAGE_PATH, expiresCookie } from '@utils'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { fetchRefreshToken } from '@utils/api'

export async function middleware(req: NextRequest) {
  const hasSession = req.cookies.has(DHI_SESSION)
  if (!hasSession)
    return NextResponse.redirect(new URL(PAGE_PATH.login, req.url))

  if (req.nextUrl.pathname === PAGE_PATH.home)
    return NextResponse.redirect(new URL(PAGE_PATH.calendar, req.url))

  const session = req.cookies.get(DHI_SESSION)
  const sessionInfo = session ? JSON.parse(session?.value) : undefined
  const access_token = sessionInfo?.access_token

  if (!sessionInfo)
    return NextResponse.redirect(new URL(PAGE_PATH.login, req.url))

  try {
    if (
      access_token &&
      access_token.split('.').length > 1 &&
      JSON.parse(Buffer.from(access_token.split('.')[1], 'base64').toString())
        .exp *
        1000 >
        Date.now()
    ) {
      return NextResponse.next()
    }

    const response = await fetchRefreshToken(sessionInfo.refresh_token)
    if (response) {
      console.info('Refreshing token...')
      const res = NextResponse.next()
      res.cookies.set(DHI_SESSION, JSON.stringify(response), {
        path: '/',
        expires: expiresCookie(),
      })
      console.info('Refresh token DONE!')
      return res
    } else {
      return NextResponse.redirect(new URL(PAGE_PATH.login, req.url))
    }
  } catch (error: any) {
    console.error(error)
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
