import { apiClient } from './client';
import { ApiResponse } from './auth';

export interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name?: string;
  language: string;
  created_at: string;
  updated_at: string;
}

export const userApi = {
  async getProfile(): Promise<UserProfile> {
    const response = await apiClient.get<ApiResponse<UserProfile>>('/api/user/profile');
    return response.data.data!;
  },

  async updateProfile(data: Partial<UserProfile>): Promise<UserProfile> {
    const response = await apiClient.put<ApiResponse<UserProfile>>('/api/user/profile', data);
    return response.data.data!;
  },
};