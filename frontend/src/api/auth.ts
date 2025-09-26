import { apiClient } from './client';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  first_name: string;
  last_name?: string;
  language?: 'ru' | 'uz' | 'en';
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    first_name: string;
    last_name?: string;
    language: string;
    created_at: string;
    updated_at: string;
  };
  accessToken: string;
  refreshToken: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

export const authApi = {
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/api/auth/login', data);
    return response.data.data!;
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/api/auth/register', data);
    return response.data.data!;
  },

  async logout(): Promise<void> {
    await apiClient.post('/api/auth/logout');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/api/auth/refresh', {
      refresh_token: refreshToken,
    });
    return response.data.data!;
  },

  async forgotPassword(email: string): Promise<void> {
    await apiClient.post('/api/auth/forgot-password', { email });
  },
};