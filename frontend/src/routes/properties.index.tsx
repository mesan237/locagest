import { createFileRoute } from '@tanstack/react-router';
import { PropertiesPage } from '../pages/properties/PropertiesPage';

export const Route = createFileRoute('/properties/')({
  component: PropertiesPage,
});
