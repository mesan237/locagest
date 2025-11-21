import React from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { propertyService } from '../../services/propertyService';
import { PropertyForm } from '../../components/features/properties/PropertyForm';
import { AppLayout } from '../../components/layout/AppLayout';
import { Spinner } from '../../components/ui/Spinner';
import type { PropertyFormData } from '../../types';

export const EditProperty: React.FC = () => {
  const { id } = useParams({ from: '/properties/$id/edit' });
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch property data
  const { data: property, isLoading } = useQuery({
    queryKey: ['property', id],
    queryFn: () => propertyService.getProperty(Number(id)),
  });

  const updateMutation = useMutation({
    mutationFn: (data: PropertyFormData) =>
      propertyService.updateProperty(Number(id), data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['property', id] });
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      navigate({ to: '/properties/$id', params: { id: response.property.id.toString() } });
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Erreur lors de la mise à jour du bien');
    },
  });

  const handleSubmit = (data: PropertyFormData) => {
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex justify-center items-center h-64">
          <Spinner />
        </div>
      </AppLayout>
    );
  }

  if (!property) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <p className="text-red-600">Bien introuvable</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Modifier le bien</h1>
          <p className="mt-2 text-gray-600">{property.name}</p>
        </div>

        <PropertyForm
          initialData={property}
          onSubmit={handleSubmit}
          isSubmitting={updateMutation.isPending}
        />
      </div>
    </AppLayout>
  );
};
