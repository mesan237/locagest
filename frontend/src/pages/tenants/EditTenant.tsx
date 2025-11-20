import React from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tenantService } from '../../services/tenantService';
import { TenantForm } from '../../components/features/tenants/TenantForm';
import { AppLayout } from '../../components/layout/AppLayout';
import { Spinner } from '../../components/ui/Spinner';
import type { TenantFormData } from '../../types';

export const EditTenant: React.FC = () => {
  const { id } = useParams({ from: '/tenants/$id/edit' });
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch tenant data
  const { data: tenant, isLoading } = useQuery({
    queryKey: ['tenant', id],
    queryFn: () => tenantService.getTenant(Number(id)),
  });

  const updateMutation = useMutation({
    mutationFn: (data: TenantFormData) =>
      tenantService.updateTenant(Number(id), data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['tenant', id] });
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      navigate({ to: '/tenants/$id', params: { id: response.tenant.id.toString() } });
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Erreur lors de la mise à jour du locataire');
    },
  });

  const handleSubmit = (data: TenantFormData, _files?: { idCardFront?: File; idCardBack?: File }) => {
    // TODO: Handle file uploads separately if needed
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

  if (!tenant) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <p className="text-red-600">Locataire introuvable</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Modifier le locataire</h1>
          <p className="mt-2 text-gray-600">{tenant.full_name}</p>
        </div>

        <TenantForm
          initialData={tenant}
          onSubmit={handleSubmit}
          isSubmitting={updateMutation.isPending}
        />
      </div>
    </AppLayout>
  );
};
