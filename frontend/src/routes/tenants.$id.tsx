import { createFileRoute, redirect } from '@tanstack/react-router';
import { TenantDetails } from '../pages/tenants/TenantDetails';
import { useAuthStore } from '../stores/authStore';

export const Route = createFileRoute('/tenants/$id')({
  beforeLoad: async () => {
    const { isAuthenticated } = useAuthStore.getState();
    if (!isAuthenticated) {
      throw redirect({ to: '/login' });
    }
  },
  component: TenantDetails,
});
