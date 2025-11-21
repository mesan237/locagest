import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tenantService } from '../../services/tenantService';
import { TenantForm } from '../../components/features/tenants/TenantForm';
import { AppLayout } from '../../components/layout/AppLayout';
import type { TenantFormData } from '../../types';

export const CreateTenant: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: TenantFormData) => tenantService.createTenant(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      navigate({ to: '/tenants/$id', params: { id: response.tenant.id.toString() } });
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Erreur lors de la création du locataire');
    },
  });

  const handleSubmit = (data: TenantFormData, _files?: { idCardFront?: File; idCardBack?: File }) => {
    // TODO: Handle file uploads separately if needed
    // For now, we'll just submit the form data
    createMutation.mutate(data);
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Nouveau locataire</h1>
          <p className="mt-2 text-gray-600">
            Enregistrez les informations du nouveau locataire
          </p>
        </div>

        <TenantForm onSubmit={handleSubmit} isSubmitting={createMutation.isPending} />
      </div>
    </AppLayout>
  );
};
