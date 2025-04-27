'use client';

import { useAuth } from '@/hooks/useAuth';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      redirect('/dashboard');
    }
  }, [user]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8">Welcome to SyncUp</h1>
        <p className="text-xl mb-4">Team collaboration and task management made simple</p>
        {!user && (
          <div className="mt-8">
            <a
              href="/login"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              Get Started
            </a>
          </div>
        )}
      </div>
    </main>
  );
} 