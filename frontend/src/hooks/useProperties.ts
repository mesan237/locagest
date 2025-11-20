import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { propertyService } from '../services/propertyService';
import type { PropertyFormData, PropertyFilters } from '../types';

export const useProperties = (filters?: PropertyFilters) => {
  const queryClient = useQueryClient();

  // Fetch properties with filters
  const {
    data: propertiesData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['properties', filters],
    queryFn: () => propertyService.getProperties(filters),
    staleTime: 30000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  // Create property mutation
  const createPropertyMutation = useMutation({
    mutationFn: (data: PropertyFormData) => propertyService.createProperty(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'stats'] });
    },
  });

  // Update property mutation
  const updatePropertyMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<PropertyFormData> }) =>
      propertyService.updateProperty(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['property', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'stats'] });
    },
  });

  // Delete property mutation
  const deletePropertyMutation = useMutation({
    mutationFn: (id: number) => propertyService.deleteProperty(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'stats'] });
    },
  });

  // Upload photos mutation
  const uploadPhotosMutation = useMutation({
    mutationFn: ({ propertyId, files }: { propertyId: number; files: File[] }) =>
      propertyService.uploadPhotos(propertyId, files),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['property', variables.propertyId] });
    },
  });

  // Delete photo mutation
  const deletePhotoMutation = useMutation({
    mutationFn: ({ propertyId, photoId }: { propertyId: number; photoId: number }) =>
      propertyService.deletePhoto(propertyId, photoId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['property', variables.propertyId] });
    },
  });

  // Set main photo mutation
  const setMainPhotoMutation = useMutation({
    mutationFn: ({ propertyId, photoId }: { propertyId: number; photoId: number }) =>
      propertyService.setMainPhoto(propertyId, photoId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['property', variables.propertyId] });
    },
  });

  return {
    // Data
    properties: propertiesData?.data || [],
    pagination: propertiesData
      ? {
          currentPage: propertiesData.current_page,
          lastPage: propertiesData.last_page,
          perPage: propertiesData.per_page,
          total: propertiesData.total,
        }
      : null,
    isLoading,
    isError,
    error,
    refetch,

    // Mutations
    createProperty: createPropertyMutation.mutate,
    createPropertyAsync: createPropertyMutation.mutateAsync,
    isCreating: createPropertyMutation.isPending,
    createError: createPropertyMutation.error,

    updateProperty: updatePropertyMutation.mutate,
    updatePropertyAsync: updatePropertyMutation.mutateAsync,
    isUpdating: updatePropertyMutation.isPending,
    updateError: updatePropertyMutation.error,

    deleteProperty: deletePropertyMutation.mutate,
    deletePropertyAsync: deletePropertyMutation.mutateAsync,
    isDeleting: deletePropertyMutation.isPending,
    deleteError: deletePropertyMutation.error,

    uploadPhotos: uploadPhotosMutation.mutate,
    uploadPhotosAsync: uploadPhotosMutation.mutateAsync,
    isUploadingPhotos: uploadPhotosMutation.isPending,
    uploadPhotosError: uploadPhotosMutation.error,

    deletePhoto: deletePhotoMutation.mutate,
    isDeletingPhoto: deletePhotoMutation.isPending,

    setMainPhoto: setMainPhotoMutation.mutate,
    isSettingMainPhoto: setMainPhotoMutation.isPending,
  };
};

export const useProperty = (id: number) => {
  const queryClient = useQueryClient();

  const {
    data: property,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['property', id],
    queryFn: () => propertyService.getProperty(id),
    enabled: !!id,
    staleTime: 30000,
    gcTime: 5 * 60 * 1000,
  });

  return {
    property,
    isLoading,
    isError,
    error,
    refetch,
  };
};
