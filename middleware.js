import { NextResponse } from 'next/server'

export function middleware(request) {
  // For now, we'll let all requests through since we're using client-side auth
  // In a real app, you'd check for valid JWT tokens here
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - auth (auth pages)
     * - / (home page)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|auth|$).*)',
  ],
}