import { createFileRoute, redirect } from '@tanstack/react-router';
import { PropertyDetails } from '../pages/properties/PropertyDetails';
import { useAuthStore } from '../stores/authStore';

export const Route = createFileRoute('/properties/$id')({
  beforeLoad: async () => {
    const { isAuthenticated } = useAuthStore.getState();
    if (!isAuthenticated) {
      throw redirect({ to: '/login' });
    }
  },
  component: PropertyDetails,
});
