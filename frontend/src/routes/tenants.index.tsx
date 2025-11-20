import { createFileRoute } from '@tanstack/react-router';
import { TenantsPage } from '../pages/tenants/TenantsPage';

export const Route = createFileRoute('/tenants/')({
  component: TenantsPage,
});
