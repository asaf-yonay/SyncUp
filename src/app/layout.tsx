import { Inter } from 'next/font/google';
import { AuthProvider } from '@/hooks/useAuth';
import { DataProvider } from '@/components/providers/DataProvider';
import PersistentVoiceNavigation from '@/components/shared/PersistentVoiceNavigation';
import './globals.css';
import '@/styles/variables.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'SyncUp',
  description: 'Team collaboration and task management',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log('[RootLayout] Rendering layout');
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <DataProvider>
            {children}
            <PersistentVoiceNavigation />
          </DataProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
