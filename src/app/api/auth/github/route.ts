import { NextResponse } from 'next/server';

export async function POST() {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const redirectUri = process.env.GITHUB_REDIRECT_URI;
  
  if (!clientId || !redirectUri) {
    return NextResponse.json({ error: 'OAuth configuration missing' }, { status: 500 });
  }

  const authUrl = `https://github.com/login/oauth/authorize?` +
    `client_id=${clientId}&` +
    `redirect_uri=${redirectUri}&` +
    `scope=user:email`;

  return NextResponse.json({ url: authUrl });
} 