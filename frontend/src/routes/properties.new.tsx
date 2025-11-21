import { createFileRoute, redirect } from '@tanstack/react-router';
import { CreateProperty } from '../pages/properties/CreateProperty';
import { useAuthStore } from '../stores/authStore';

export const Route = createFileRoute('/properties/new')({
  beforeLoad: async () => {
    const { isAuthenticated } = useAuthStore.getState();
    if (!isAuthenticated) {
      throw redirect({ to: '/login' });
    }
  },
  component: CreateProperty,
});
