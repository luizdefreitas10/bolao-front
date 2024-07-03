import type { NextRequest } from 'next/server'
import { decodeToken } from './utils/jwt'

export function middleware(request: NextRequest) {
  const currentUser = request.cookies.get('qxute-bolao:x-token')?.value

  if (currentUser) {
    const decoded = decodeToken(currentUser)
    if (
      decoded?.role !== 'ADMIN' &&
      request.nextUrl.pathname.startsWith('/home-admin')
    ) {
      return Response.redirect(new URL('/home-user', request.url))
    }
  }

  if (
    !currentUser &&
    (request.nextUrl.pathname.startsWith('/home-admin') ||
      request.nextUrl.pathname.startsWith('/home-user'))
  ) {
    return Response.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
