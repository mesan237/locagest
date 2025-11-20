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
  reference: string;
  name: string;
  type: 'apartment' | 'house' | 'commercial' | 'parking' | 'land' | 'office';
  type_label: string;
  status: 'available' | 'rented' | 'maintenance' | 'reserved';
  status_label: string;

  // Address
  address: string;
  address_complement?: string;
  city: string;
  postal_code: string;
  country: string;
  full_address: string;

  // Specifications
  surface_area: number;
  rooms?: number;
  bedrooms?: number;
  bathrooms?: number;
  floor?: number;
  construction_year?: number;

  // Description
  description?: string;
  features?: string[];
  equipment?: string[];

  // Amenities
  is_furnished: boolean;
  has_parking: boolean;
  has_elevator: boolean;
  has_balcony: boolean;
  has_terrace: boolean;
  has_garden: boolean;
  has_garage: boolean;
  has_cellar: boolean;

  // Energy
  energy_rating?: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';
  ges_rating?: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';
  energy_consumption?: number;
  ges_emission?: number;

  // Financial
  estimated_value?: number;

  // Location
  latitude?: number;
  longitude?: number;
  cadastral_reference?: string;

  // Relationships
  photos?: PropertyPhoto[];
  main_photo?: PropertyPhoto;
  leases_count?: number;

  // Timestamps
  created_at: string;
  updated_at: string;
}

export interface PropertyPhoto {
  id: number;
  property_id: number;
  file_name: string;
  file_path: string;
  file_url: string;
  file_size: number;
  file_size_human: string;
  mime_type: string;
  width: number;
  height: number;
  display_order: number;
  is_main: boolean;
  caption?: string;
  created_at: string;
  updated_at: string;
}

export interface PropertyFormData {
  name: string;
  type: 'apartment' | 'house' | 'commercial' | 'parking' | 'land' | 'office';
  address: string;
  address_complement?: string;
  city: string;
  postal_code: string;
  country: string;
  surface_area: number;
  rooms?: number;
  bedrooms?: number;
  bathrooms?: number;
  floor?: number;
  construction_year?: number;
  description?: string;
  features?: string[];
  equipment?: string[];
  status?: 'available' | 'rented' | 'maintenance' | 'reserved';
  is_furnished?: boolean;
  has_parking?: boolean;
  has_elevator?: boolean;
  has_balcony?: boolean;
  has_terrace?: boolean;
  has_garden?: boolean;
  has_garage?: boolean;
  has_cellar?: boolean;
  energy_rating?: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';
  ges_rating?: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';
  energy_consumption?: number;
  ges_emission?: number;
  estimated_value?: number;
  latitude?: number;
  longitude?: number;
  cadastral_reference?: string;
}

export interface PropertyFilters {
  status?: string;
  type?: string;
  city?: string;
  search?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}

export interface Tenant {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  phone: string;
  phone_secondary?: string;

  // Personal Information
  birth_date: string;
  birth_place?: string;
  age?: number;
  nationality: string;

  // ID Card
  id_card_number?: string;
  id_card_type?: 'id_card' | 'passport' | 'residence_permit';
  id_card_type_label?: string;
  id_card_expiry_date?: string;
  id_card_front_path?: string;
  id_card_back_path?: string;

  // Professional Information
  profession?: string;
  employer?: string;
  monthly_income?: number;

  // Status
  is_active: boolean;
  notes?: string;

  // Relationships
  leases_count?: number;

  // Timestamps
  created_at: string;
  updated_at: string;
}

export interface TenantFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  phone_secondary?: string;
  birth_date: string;
  birth_place?: string;
  nationality: string;
  id_card_number?: string;
  id_card_type?: 'id_card' | 'passport' | 'residence_permit';
  id_card_expiry_date?: string;
  profession?: string;
  employer?: string;
  monthly_income?: number;
  notes?: string;
  is_active?: boolean;
}

export interface TenantFilters {
  is_active?: boolean;
  search?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
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
