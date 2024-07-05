import { clerkMiddleware,createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher(["/protectedroute", "/services(.*)"]); //addYourSpecificRoutesInHereInTheFormOfAnArrayElement

export default clerkMiddleware((auth, req) => {
  console.log('middleware');
  if (isProtectedRoute(req)) {
    auth().protect();
  }
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};