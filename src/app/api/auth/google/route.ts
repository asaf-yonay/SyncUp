import { NextResponse } from 'next/server';

export async function POST() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;
  
  if (!clientId || !redirectUri) {
    return NextResponse.json({ error: 'OAuth configuration missing' }, { status: 500 });
  }

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${clientId}&` +
    `redirect_uri=${redirectUri}&` +
    `response_type=code&` +
    `scope=email profile&` +
    `access_type=offline&` +
    `prompt=consent`;

  return NextResponse.json({ url: authUrl });
} 