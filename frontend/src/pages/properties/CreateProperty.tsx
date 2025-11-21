import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { propertyService } from '../../services/propertyService';
import { PropertyForm } from '../../components/features/properties/PropertyForm';
import { AppLayout } from '../../components/layout/AppLayout';
import type { PropertyFormData } from '../../types';

export const CreateProperty: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: PropertyFormData) => propertyService.createProperty(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      navigate({ to: '/properties/$id', params: { id: response.property.id.toString() } });
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Erreur lors de la création du bien');
    },
  });

  const handleSubmit = (data: PropertyFormData) => {
    createMutation.mutate(data);
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Nouveau bien immobilier</h1>
          <p className="mt-2 text-gray-600">
            Remplissez les informations du bien à ajouter à votre portefeuille
          </p>
        </div>

        <PropertyForm onSubmit={handleSubmit} isSubmitting={createMutation.isPending} />
      </div>
    </AppLayout>
  );
};
