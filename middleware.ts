import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] Middleware processing request:`, {
    path: request.nextUrl.pathname,
    search: request.nextUrl.search,
    method: request.method
  });

  // Create a response object that we can modify
  const res = NextResponse.next();

  // Create a Supabase client configured to use cookies
  const supabase = createMiddlewareClient({ req: request, res });

  // Refresh session if expired - required for Server Components
  const { data: { session }, error } = await supabase.auth.getSession();
  
  console.log(`[${timestamp}] Session check result:`, {
    hasSession: !!session,
    userId: session?.user?.id,
    error: error?.message
  });

  // Handle static files and login page
  if (
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/static') ||
    request.nextUrl.pathname === '/login'
  ) {
    console.log(`[${timestamp}] Allowing access to:`, request.nextUrl.pathname);
    return res;
  }

  // Handle auth callback
  if (request.nextUrl.pathname === '/auth/callback') {
    console.log(`[${timestamp}] Processing auth callback:`, {
      hasSession: !!session,
      search: request.nextUrl.search,
      hash: request.nextUrl.hash
    });
    return res;
  }

  // Handle API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    console.log(`[${timestamp}] Processing API route:`, {
      path: request.nextUrl.pathname,
      hasSession: !!session
    });
    return res;
  }

  // Redirect to login if no session
  if (!session) {
    console.log(`[${timestamp}] No session found, redirecting to login:`, {
      originalPath: request.nextUrl.pathname
    });
    
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('redirectedFrom', request.nextUrl.pathname);
    
    return NextResponse.redirect(redirectUrl);
  }

  console.log(`[${timestamp}] Allowing access to protected route:`, {
    path: request.nextUrl.pathname,
    userId: session.user.id
  });

  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}; 