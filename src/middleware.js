import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server';


// const isProtectedRoute = createRouteMatcher([
//   '/dashboard(.*)',
// ]);

export default clerkMiddleware((auth, req) => {
  const {userId}=auth();
  const currentUrl=new URL(req.url);
  const isDashboard=currentUrl.pathname.startsWith('/dashboard');

  if(!userId && isDashboard){
    return NextResponse.redirect(new URL('/sign-in',req.url));
  }
});


export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};