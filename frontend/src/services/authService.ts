import { apiClient } from '../api/client';
import type { User } from '../types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone?: string;
  company_name?: string;
  company_siret?: string;
  is_company: boolean;
}

export interface UpdateProfileData {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  company_name?: string;
  company_siret?: string;
  timezone?: string;
  language?: string;
}

export interface UpdatePasswordData {
  current_password: string;
  password: string;
  password_confirmation: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  message: string;
}

export interface MessageResponse {
  message: string;
}

class AuthService {
  /**
   * Register a new user
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    return response.data;
  }

  /**
   * Login user
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  }

  /**
   * Get current authenticated user
   */
  async me(): Promise<User> {
    const response = await apiClient.get<User>('/auth/me');
    return response.data;
  }

  /**
   * Update user profile
   */
  async updateProfile(data: UpdateProfileData): Promise<User> {
    const response = await apiClient.put<User>('/auth/profile', data);
    return response.data;
  }

  /**
   * Update user password
   */
  async updatePassword(data: UpdatePasswordData): Promise<MessageResponse> {
    const response = await apiClient.put<MessageResponse>('/auth/password', data);
    return response.data;
  }

  /**
   * Logout current session
   */
  async logout(): Promise<MessageResponse> {
    const response = await apiClient.post<MessageResponse>('/auth/logout');
    return response.data;
  }

  /**
   * Logout all sessions
   */
  async logoutAll(): Promise<MessageResponse> {
    const response = await apiClient.post<MessageResponse>('/auth/logout-all');
    return response.data;
  }

  /**
   * Delete user account
   */
  async deleteAccount(): Promise<MessageResponse> {
    const response = await apiClient.delete<MessageResponse>('/auth/account');
    return response.data;
  }
}

export const authService = new AuthService();
