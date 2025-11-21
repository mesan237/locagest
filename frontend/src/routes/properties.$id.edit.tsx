import { createFileRoute, redirect } from '@tanstack/react-router';
import { EditProperty } from '../pages/properties/EditProperty';
import { useAuthStore } from '../stores/authStore';

export const Route = createFileRoute('/properties/$id/edit')({
  beforeLoad: async () => {
    const { isAuthenticated } = useAuthStore.getState();
    if (!isAuthenticated) {
      throw redirect({ to: '/login' });
    }
  },
  component: EditProperty,
});
