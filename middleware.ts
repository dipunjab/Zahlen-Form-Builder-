// middleware.ts
import { getToken } from 'next-auth/jwt'
import { NextResponse, NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })

  const url = request.nextUrl
  const isAuth = !!token
  const isAuthPage =
    url.pathname.startsWith('/sign-in') ||
    url.pathname.startsWith('/sign-up') ||
    url.pathname.startsWith('/verify')

  if (url.pathname.startsWith('/api/auth')) {
    return NextResponse.next()
  }

  if (isAuth && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  const protectedPaths = ['/dashboard', '/form', '/settings']
  const isProtected = protectedPaths.some(path => url.pathname.startsWith(path))

  if (!isAuth && isProtected) {
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/sign-in',
    '/sign-up',
    '/verify/:path*',
    '/dashboard/:path*',
    '/form/:path*',
    '/settings/:path*',
    '/api/auth/:path*', 
  ],
}
