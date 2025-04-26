import { redirect } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function Home() {
  const { user } = useAuth();
  
  if (user) {
    redirect('/dashboard');
  } else {
    redirect('/login');
  }
} 