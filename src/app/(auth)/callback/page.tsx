'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CallbackPage() {
  const router = useRouter();

  useEffect(() => {
    console.log(`[${new Date().toISOString()}] Callback page mounted`);
    
    const handleCallback = async () => {
      console.log(`[${new Date().toISOString()}] Starting callback handling`);
      
      const url = new URL(window.location.href);
      const state = url.searchParams.get('state');
      const code = url.searchParams.get('code');
      
      console.log(`[${new Date().toISOString()}] Full URL details:`, {
        href: window.location.href,
        origin: window.location.origin,
        pathname: window.location.pathname,
        search: window.location.search,
        hash: window.location.hash,
        state: state ? 'present' : 'missing',
        code: code ? 'present' : 'missing'
      });

      // Get the hash fragment
      const hash = window.location.hash.substring(1);
      if (!hash) {
        console.error(`[${new Date().toISOString()}] No hash fragment found in URL`);
        window.location.href = '/login?error=no_hash';
        return;
      }

      // Log raw hash for debugging
      console.log(`[${new Date().toISOString()}] Raw hash fragment:`, hash);

      try {
        const params = new URLSearchParams(hash);
        
        // Log all parameters found in hash
        console.log(`[${new Date().toISOString()}] All hash parameters:`, {
          keys: Array.from(params.keys()),
          values: Array.from(params.entries()).map(([key, value]) => ({
            key,
            length: value.length,
            startsWith: value.substring(0, 10) + '...'
          }))
        });
        
        // Extract all tokens
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');
        const expiresAt = params.get('expires_at');
        const providerToken = params.get('provider_token');
        const providerRefreshToken = params.get('provider_refresh_token');
        
        console.log(`[${new Date().toISOString()}] Token details:`, {
          accessToken: accessToken ? {
            length: accessToken.length,
            startsWith: accessToken.substring(0, 10) + '...'
          } : 'missing',
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

        if (!accessToken) {
          console.error(`[${new Date().toISOString()}] No access token in hash fragment`);
          window.location.href = '/login?error=no_token';
          return;
        }
        
        // Get the pre-auth URL from localStorage
        const preAuthUrl = localStorage.getItem('preAuthUrl') || '/';
        console.log(`[${new Date().toISOString()}] Pre-auth URL from localStorage:`, preAuthUrl);
        
        // Create a URL with the tokens as query parameters
        const redirectUrl = new URL('/api/auth/callback', window.location.origin);
        
        // Encode tokens to ensure they're properly handled in the URL
        redirectUrl.searchParams.set('access_token', encodeURIComponent(accessToken));
        if (refreshToken) redirectUrl.searchParams.set('refresh_token', encodeURIComponent(refreshToken));
        if (expiresAt) redirectUrl.searchParams.set('expires_at', encodeURIComponent(expiresAt));
        if (providerToken) redirectUrl.searchParams.set('provider_token', encodeURIComponent(providerToken));
        if (providerRefreshToken) redirectUrl.searchParams.set('provider_refresh_token', encodeURIComponent(providerRefreshToken));
        redirectUrl.searchParams.set('preAuthUrl', preAuthUrl);
        
        console.log(`[${new Date().toISOString()}] Redirect URL details:`, {
          href: redirectUrl.toString(),
          search: redirectUrl.search,
          hasAccessToken: redirectUrl.searchParams.has('access_token'),
          hasRefreshToken: redirectUrl.searchParams.has('refresh_token'),
          hasExpiresAt: redirectUrl.searchParams.has('expires_at'),
          hasProviderToken: redirectUrl.searchParams.has('provider_token'),
          hasProviderRefreshToken: redirectUrl.searchParams.has('provider_refresh_token')
        });
        
        // Redirect to the server route
        window.location.href = redirectUrl.toString();
      } catch (err) {
        console.error(`[${new Date().toISOString()}] Error processing hash fragment:`, err);
        window.location.href = '/login?error=hash_processing_error';
      }
    };

    handleCallback();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Completing Sign In...</h1>
        <p className="text-gray-600">Please wait while we process your authentication.</p>
      </div>
    </div>
  );
} 