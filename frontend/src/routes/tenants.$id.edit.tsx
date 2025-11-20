import { createFileRoute, redirect } from '@tanstack/react-router';
import { EditTenant } from '../pages/tenants/EditTenant';
import { useAuthStore } from '../stores/authStore';

export const Route = createFileRoute('/tenants/$id/edit')({
  beforeLoad: async () => {
    const { isAuthenticated } = useAuthStore.getState();
    if (!isAuthenticated) {
      throw redirect({ to: '/login' });
    }
  },
  component: EditTenant,
});
