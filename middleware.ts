import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  // استخراج tenant من subdomain أو path /r/[slug]
  const url = req.nextUrl
  const pathname = url.pathname

  // إذا المسار /r/:restaurantSlug/...
  const match = pathname.match(/^\/r\/([^\/]+)/)
  if (match) {
    const slug = match[1]
    const requestHeaders = new Headers(req.headers)
    requestHeaders.set('x-restaurant-slug', slug)
    return NextResponse.next({ request: { headers: requestHeaders } })
  }

  // حماية لوحات التحكم - سيتم التحقق عبر Auth.js لاحقاً
  return NextResponse.next()
}

export const config = {
  matcher: ['/r/:path*', '/dashboard/:path*', '/super/:path*', '/api/:path*']
}
