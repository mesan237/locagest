import { createFileRoute, redirect } from '@tanstack/react-router';
import { CreateTenant } from '../pages/tenants/CreateTenant';
import { useAuthStore } from '../stores/authStore';

export const Route = createFileRoute('/tenants/new')({
  beforeLoad: async () => {
    const { isAuthenticated } = useAuthStore.getState();
    if (!isAuthenticated) {
      throw redirect({ to: '/login' });
    }
  },
  component: CreateTenant,
});
