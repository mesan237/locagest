import { createFileRoute, redirect } from '@tanstack/react-router';
import { Dashboard } from '../pages/dashboard/Dashboard';

export const Route = createFileRoute('/dashboard')({
  beforeLoad: ({ context }) => {
    // Redirect to login if not authenticated
    if (!context.isAuthenticated) {
      throw redirect({ to: '/login' });
    }
  },
  component: Dashboard,
});
