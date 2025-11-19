import { createFileRoute, redirect } from '@tanstack/react-router';
import { Register } from '../pages/auth/Register';

export const Route = createFileRoute('/register')({
  beforeLoad: ({ context }) => {
    // Redirect to dashboard if already authenticated
    if (context.isAuthenticated) {
      throw redirect({ to: '/dashboard' });
    }
  },
  component: Register,
});
