import { createFileRoute, redirect } from '@tanstack/react-router';
import { TenantsPage } from '../pages/tenants/TenantsPage';

export const Route = createFileRoute('/tenants')({
  component: TenantsPage,
  beforeLoad: ({ context }) => {
    if (!context.isAuthenticated) {
      throw redirect({
        to: '/login',
      });
    }
  },
});
