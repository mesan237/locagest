import { createFileRoute, redirect } from '@tanstack/react-router';
import { Login } from '../pages/auth/Login';

export const Route = createFileRoute('/login')({
  beforeLoad: ({ context }) => {
    // Redirect to dashboard if already authenticated
    if (context.isAuthenticated) {
      throw redirect({ to: '/dashboard' });
    }
  },
  component: Login,
});
