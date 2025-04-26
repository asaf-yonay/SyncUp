import { AuthProvider } from '@/hooks/useAuth';
import './globals.css';
import '@/styles/variables.css'

export const metadata = {
  title: 'SyncUp',
  description: 'Team collaboration platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
