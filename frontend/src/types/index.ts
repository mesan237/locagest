// Types globaux pour l'application

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string;
  phone?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  company_name?: string;
  company_siret?: string;
  is_company: boolean;
  avatar_path?: string;
  timezone?: string;
  language?: string;
  notification_preferences?: Record<string, any>;
  last_login_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Property {
  id: number;
  name: string;
  type: 'apartment' | 'house' | 'commercial' | 'parking';
  address: string;
  city: string;
  postal_code: string;
  surface_area: number;
  rooms: number;
  bedrooms: number;
  bathrooms: number;
  description?: string;
  monthly_rent: number;
  charges: number;
  deposit: number;
  status: 'available' | 'rented' | 'maintenance';
  photos?: PropertyPhoto[];
  created_at: string;
  updated_at: string;
}

export interface PropertyPhoto {
  id: number;
  property_id: number;
  url: string;
  is_main: boolean;
  created_at: string;
}

export interface Tenant {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  birth_date: string;
  nationality: string;
  id_card_number?: string;
  profession?: string;
  current_lease_id?: number;
  created_at: string;
  updated_at: string;
}

export interface Lease {
  id: number;
  property_id: number;
  tenant_id: number;
  start_date: string;
  end_date?: string;
  monthly_rent: number;
  charges: number;
  deposit: number;
  rent_day: number; // Jour du mois pour le paiement
  status: 'active' | 'terminated' | 'pending';
  property?: Property;
  tenant?: Tenant;
  created_at: string;
  updated_at: string;
}

export interface Rent {
  id: number;
  lease_id: number;
  period_month: number; // 1-12
  period_year: number;
  amount: number;
  charges: number;
  total_amount: number;
  due_date: string;
  paid_date?: string;
  status: 'pending' | 'paid' | 'late' | 'partial';
  payment_method?: 'cash' | 'check' | 'transfer' | 'card';
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: number;
  type: 'lease' | 'receipt' | 'inventory' | 'insurance' | 'other';
  name: string;
  file_path: string;
  file_url: string;
  documentable_type: string; // Property, Tenant, Lease, etc.
  documentable_id: number;
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  total_properties: number;
  rented_properties: number;
  available_properties: number;
  total_tenants: number;
  monthly_revenue: number;
  pending_payments: number;
  occupancy_rate: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}
