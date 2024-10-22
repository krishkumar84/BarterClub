import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isAdminRoute = createRouteMatcher(['/admin(.*)'])
const isProtectedRoute = createRouteMatcher(['/profile(.*)', '/addProduct(.*)'])

export default clerkMiddleware((auth, req) => {
  // Protect all routes starting with `/admin`
  const sessionClaims = auth().sessionClaims as any; // Treats sessionClaims as 'any'
  if (isProtectedRoute(req)) auth().protect()
  if (isAdminRoute(req) && sessionClaims?.userId?.role as any !== 'admin') {
    const url = new URL('/', req.url)
    return NextResponse.redirect(url)
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}