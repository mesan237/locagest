import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tenantService } from '../services/tenantService';
import type {
  Tenant,
  TenantFormData,
  TenantFilters,
  PaginatedResponse
} from '../types';

/**
 * Hook for managing tenants with React Query
 */
export const useTenants = (filters?: TenantFilters) => {
  const queryClient = useQueryClient();

  // Query to fetch all tenants
  const {
    data: tenantsData,
    isLoading,
    isError,
    error,
  } = useQuery<PaginatedResponse<Tenant>>({
    queryKey: ['tenants', filters],
    queryFn: () => tenantService.getTenants(filters),
    staleTime: 30000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  // Mutation to create a tenant
  const createTenantMutation = useMutation({
    mutationFn: (data: TenantFormData) => tenantService.createTenant(data),
    onSuccess: () => {
      // Invalidate and refetch tenants
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
    },
  });

  // Mutation to update a tenant
  const updateTenantMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<TenantFormData> }) =>
      tenantService.updateTenant(id, data),
    onSuccess: (_, variables) => {
      // Invalidate tenants list and specific tenant
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      queryClient.invalidateQueries({ queryKey: ['tenant', variables.id] });
    },
  });

  // Mutation to delete a tenant
  const deleteTenantMutation = useMutation({
    mutationFn: (id: number) => tenantService.deleteTenant(id),
    onSuccess: () => {
      // Invalidate tenants list
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
    },
  });

  return {
    // Data
    tenants: tenantsData?.data || [],
    pagination: tenantsData
      ? {
          current_page: tenantsData.current_page,
          last_page: tenantsData.last_page,
          per_page: tenantsData.per_page,
          total: tenantsData.total,
        }
      : null,

    // Loading states
    isLoading,
    isError,
    error,

    // Mutations
    createTenant: createTenantMutation.mutate,
    updateTenant: updateTenantMutation.mutate,
    deleteTenant: deleteTenantMutation.mutate,

    // Mutation states
    isCreating: createTenantMutation.isPending,
    isUpdating: updateTenantMutation.isPending,
    isDeleting: deleteTenantMutation.isPending,

    // Mutation errors
    createError: createTenantMutation.error,
    updateError: updateTenantMutation.error,
    deleteError: deleteTenantMutation.error,
  };
};

/**
 * Hook for fetching a single tenant
 */
export const useTenant = (id: number) => {
  const {
    data: tenant,
    isLoading,
    isError,
    error,
  } = useQuery<Tenant>({
    queryKey: ['tenant', id],
    queryFn: () => tenantService.getTenant(id),
    staleTime: 30000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!id, // Only run if id is provided
  });

  return {
    tenant,
    isLoading,
    isError,
    error,
  };
};
