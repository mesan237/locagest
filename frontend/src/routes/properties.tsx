import { createFileRoute, redirect } from '@tanstack/react-router';
import { PropertiesPage } from '../pages/properties/PropertiesPage';

export const Route = createFileRoute('/properties')({
  component: PropertiesPage,
  beforeLoad: ({ context }) => {
    if (!context.isAuthenticated) {
      throw redirect({
        to: '/login',
      });
    }
  },
});
