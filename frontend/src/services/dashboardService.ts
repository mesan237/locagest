import { apiClient } from '../api/client';

export interface DashboardStats {
  total_properties: number;
  rented_properties: number;
  available_properties: number;
  total_tenants: number;
  monthly_revenue: number;
  pending_payments: number;
  occupancy_rate: number;
}

export interface RecentRent {
  id: number;
  property_name: string;
  tenant_name: string;
  amount: number;
  status: string;
  due_date: string;
  paid_date?: string;
}

export interface UpcomingRent {
  id: number;
  property_name: string;
  tenant_name: string;
  amount: number;
  due_date: string;
}

export interface DashboardData {
  stats: DashboardStats;
  recent_rents: RecentRent[];
  upcoming_rents: UpcomingRent[];
}

class DashboardService {
  /**
   * Get dashboard statistics and data
   */
  async getStats(): Promise<DashboardData> {
    const response = await apiClient.get<DashboardData>('/dashboard/stats');
    return response.data;
  }
}

export const dashboardService = new DashboardService();
