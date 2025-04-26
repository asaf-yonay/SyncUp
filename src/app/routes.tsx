import DashboardPage from '@/pages/DashboardPage';
import LoginPage from '@/pages/LoginPage';

export const routes = {
  dashboard: {
    path: '/dashboard',
    component: DashboardPage,
  },
  login: {
    path: '/login',
    component: LoginPage,
  },
} as const;

export type Route = keyof typeof routes; 