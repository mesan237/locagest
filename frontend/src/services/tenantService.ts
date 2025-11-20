import apiClient from './apiClient';
import type {
  Tenant,
  TenantFormData,
  TenantFilters,
  PaginatedResponse
} from '../types';

class TenantService {
  /**
   * Get all tenants with optional filters
   */
  async getTenants(filters?: TenantFilters): Promise<PaginatedResponse<Tenant>> {
    const params = new URLSearchParams();

    if (filters) {
      if (filters.is_active !== undefined) {
        params.append('is_active', filters.is_active ? '1' : '0');
      }
      if (filters.search) {
        params.append('search', filters.search);
      }
      if (filters.sort_by) {
        params.append('sort_by', filters.sort_by);
      }
      if (filters.sort_order) {
        params.append('sort_order', filters.sort_order);
      }
      if (filters.per_page) {
        params.append('per_page', filters.per_page.toString());
      }
      if (filters.page) {
        params.append('page', filters.page.toString());
      }
    }

    const queryString = params.toString();
    const url = queryString ? `/tenants?${queryString}` : '/tenants';

    const response = await apiClient.get<PaginatedResponse<Tenant>>(url);
    return response.data;
  }

  /**
   * Get a single tenant by ID
   */
  async getTenant(id: number): Promise<Tenant> {
    const response = await apiClient.get<{ data: Tenant }>(`/tenants/${id}`);
    return response.data.data;
  }

  /**
   * Create a new tenant
   */
  async createTenant(data: TenantFormData): Promise<{ message: string; tenant: Tenant }> {
    const response = await apiClient.post<{ message: string; data: Tenant }>('/tenants', data);
    return {
      message: response.data.message,
      tenant: response.data.data,
    };
  }

  /**
   * Update an existing tenant
   */
  async updateTenant(
    id: number,
    data: Partial<TenantFormData>
  ): Promise<{ message: string; tenant: Tenant }> {
    const response = await apiClient.put<{ message: string; data: Tenant }>(
      `/tenants/${id}`,
      data
    );
    return {
      message: response.data.message,
      tenant: response.data.data,
    };
  }

  /**
   * Delete a tenant
   */
  async deleteTenant(id: number): Promise<{ message: string }> {
    const response = await apiClient.delete<{ message: string }>(`/tenants/${id}`);
    return response.data;
  }
}

export const tenantService = new TenantService();
