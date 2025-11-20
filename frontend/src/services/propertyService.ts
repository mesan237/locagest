import { apiClient } from '../api/client';
import type { Property, PropertyFormData, PropertyFilters, PropertyPhoto, PaginatedResponse } from '../types';

class PropertyService {
  /**
   * Get paginated list of properties with optional filters
   */
  async getProperties(filters?: PropertyFilters): Promise<PaginatedResponse<Property>> {
    const params = new URLSearchParams();

    if (filters?.status) params.append('status', filters.status);
    if (filters?.type) params.append('type', filters.type);
    if (filters?.city) params.append('city', filters.city);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.sort_by) params.append('sort_by', filters.sort_by);
    if (filters?.sort_order) params.append('sort_order', filters.sort_order);
    if (filters?.per_page) params.append('per_page', filters.per_page.toString());
    if (filters?.page) params.append('page', filters.page.toString());

    const queryString = params.toString();
    const url = queryString ? `/properties?${queryString}` : '/properties';

    const response = await apiClient.get<PaginatedResponse<Property>>(url);
    return response.data;
  }

  /**
   * Get a single property by ID
   */
  async getProperty(id: number): Promise<Property> {
    const response = await apiClient.get<Property>(`/properties/${id}`);
    return response.data;
  }

  /**
   * Create a new property
   */
  async createProperty(data: PropertyFormData): Promise<{ message: string; property: Property }> {
    const response = await apiClient.post<{ message: string; property: Property }>('/properties', data);
    return response.data;
  }

  /**
   * Update an existing property
   */
  async updateProperty(id: number, data: Partial<PropertyFormData>): Promise<{ message: string; property: Property }> {
    const response = await apiClient.put<{ message: string; property: Property }>(`/properties/${id}`, data);
    return response.data;
  }

  /**
   * Delete a property (soft delete)
   */
  async deleteProperty(id: number): Promise<{ message: string }> {
    const response = await apiClient.delete<{ message: string }>(`/properties/${id}`);
    return response.data;
  }

  /**
   * Upload photos for a property
   */
  async uploadPhotos(propertyId: number, files: File[]): Promise<{ message: string; photos: PropertyPhoto[]; property: Property }> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('photos[]', file);
    });

    const response = await apiClient.post<{ message: string; photos: PropertyPhoto[]; property: Property }>(
      `/properties/${propertyId}/photos`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  }

  /**
   * Delete a photo
   */
  async deletePhoto(propertyId: number, photoId: number): Promise<{ message: string; property: Property }> {
    const response = await apiClient.delete<{ message: string; property: Property }>(
      `/properties/${propertyId}/photos/${photoId}`
    );
    return response.data;
  }

  /**
   * Set a photo as the main photo
   */
  async setMainPhoto(propertyId: number, photoId: number): Promise<{ message: string; property: Property }> {
    const response = await apiClient.put<{ message: string; property: Property }>(
      `/properties/${propertyId}/photos/${photoId}/main`
    );
    return response.data;
  }
}

export const propertyService = new PropertyService();
