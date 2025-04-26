import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  console.log(`[${new Date().toISOString()}] API Callback Request URL:`, requestUrl.toString());
  console.log(`[${new Date().toISOString()}] API Callback Request parameters:`, {
    hasAccessToken: requestUrl.searchParams.has('access_token'),
    hasRefreshToken: requestUrl.searchParams.has('refresh_token'),
    hasExpiresAt: requestUrl.searchParams.has('expires_at'),
    hasProviderToken: requestUrl.searchParams.has('provider_token'),
    hasProviderRefreshToken: requestUrl.searchParams.has('provider_refresh_token'),
    hasPreAuthUrl: requestUrl.searchParams.has('preAuthUrl')
  });

  try {
    // Decode and extract all tokens
    const accessToken = requestUrl.searchParams.get('access_token');
    const refreshToken = requestUrl.searchParams.get('refresh_token');
    const expiresAt = requestUrl.searchParams.get('expires_at');
    const providerToken = requestUrl.searchParams.get('provider_token');
    const providerRefreshToken = requestUrl.searchParams.get('provider_refresh_token');
    const preAuthUrl = requestUrl.searchParams.get('preAuthUrl') || '/';

    if (!accessToken) {
      console.error(`[${new Date().toISOString()}] No access token in callback`);
      return NextResponse.redirect(new URL('/login?error=no_token', requestUrl.origin));
    }

    // Log token details (without exposing full tokens)
    console.log(`[${new Date().toISOString()}] Token details:`, {
      accessToken: {
        length: accessToken.length,
        startsWith: accessToken.substring(0, 10) + '...'
      },
      refreshToken: refreshToken ? {
        length: refreshToken.length,
        startsWith: refreshToken.substring(0, 10) + '...'
      } : 'missing',
      expiresAt,
      providerToken: providerToken ? {
        length: providerToken.length,
        startsWith: providerToken.substring(0, 10) + '...'
      } : 'missing',
      providerRefreshToken: providerRefreshToken ? {
        length: providerRefreshToken.length,
        startsWith: providerRefreshToken.substring(0, 10) + '...'
      } : 'missing'
    });

    const supabase = createRouteHandlerClient({ cookies });
    
    // Create a session object
    const session = {
      access_token: accessToken,
      refresh_token: refreshToken || undefined,
      expires_at: expiresAt ? parseInt(expiresAt) : undefined,
      provider_token: providerToken || undefined,
      provider_refresh_token: providerRefreshToken || undefined,
      user: null // Will be populated by Supabase
    };

    console.log(`[${new Date().toISOString()}] Setting session with:`, {
      hasAccessToken: !!session.access_token,
      hasRefreshToken: !!session.refresh_token,
      expiresAt: session.expires_at,
      hasProviderToken: !!session.provider_token,
      tokenLength: session.access_token?.length || 0
    });

    // Set the session
    const { data: { session: newSession }, error: sessionError } = await supabase.auth.setSession(session);
    
    if (sessionError) {
      console.error(`[${new Date().toISOString()}] Session set error:`, sessionError);
      return NextResponse.redirect(new URL(`/login?error=session_error`, requestUrl.origin));
    }

    if (!newSession) {
      console.error(`[${new Date().toISOString()}] No session returned after setSession`);
      return NextResponse.redirect(new URL(`/login?error=no_session`, requestUrl.origin));
    }

    console.log(`[${new Date().toISOString()}] Session set successfully:`, {
      userId: newSession.user.id,
      expiresAt: newSession.expires_at,
      accessTokenLength: newSession.access_token?.length || 0,
      refreshTokenLength: newSession.refresh_token?.length || 0
    });
    
    // Create response with redirect
    const response = NextResponse.redirect(new URL(preAuthUrl, requestUrl.origin));
    
    // Set session cookies explicitly
    if (newSession.access_token) {
      response.cookies.set('sb-access-token', newSession.access_token, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      });
    }
    
    if (newSession.refresh_token) {
      response.cookies.set('sb-refresh-token', newSession.refresh_token, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      });
    }

    console.log(`[${new Date().toISOString()}] Response details:`, {
      status: response.status,
      hasAccessTokenCookie: response.cookies.has('sb-access-token'),
      hasRefreshTokenCookie: response.cookies.has('sb-refresh-token'),
      redirectUrl: preAuthUrl
    });

    return response;
  } catch (err) {
    console.error(`[${new Date().toISOString()}] Unexpected error during session setup:`, err);
    return NextResponse.redirect(new URL(`/login?error=server_error`, requestUrl.origin));
  }
} 