import { Suspense } from 'react';
import { LoginLayout } from '@/components/auth/LoginLayout';
import { LoginHeader } from '@/components/auth/LoginHeader';
import { OAuthButtons } from '@/components/auth/OAuthButtons';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';

export default function LoginPage() {
  return (
    <LoginLayout>
      <LoginHeader />
      <ErrorBoundary>
        <Suspense fallback={<div>Loading...</div>}>
          <OAuthButtons />
        </Suspense>
      </ErrorBoundary>
    </LoginLayout>
  );
} 