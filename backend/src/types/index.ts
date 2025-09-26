export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface JWTPayload {
  userId: string;
  email: string;
  type: 'access' | 'refresh';
}

import { Request } from 'express';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

// Payment types
export interface PaymentCreateRequest {
  planId: string;
  amount: number;
  currency: string;
  provider: 'click' | 'payme';
}

export interface PaymentWebhookRequest {
  transaction_id: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  provider: 'click' | 'payme';
}

// VPN types
export interface VPNConfig {
  config: string;
  qrCode: string;
}

// MarzBan API types
export interface MarzBanUser {
  username: string;
  password: string;
  expire: number;
  data_limit: number;
  proxies: Record<string, unknown>;
}

export interface MarzBanCreateUserRequest {
  username: string;
  proxies: Record<string, unknown>;
  expire: number;
  data_limit: number;
  status: 'active' | 'disabled';
}

export interface MarzBanUserResponse {
  username: string;
  proxies: Record<string, unknown>;
  expire: number;
  data_limit: number;
  data_limit_reset_strategy: string;
  status: 'active' | 'disabled' | 'limited' | 'expired';
  used_traffic: number;
  created_at: string;
  links: string[];
  subscription_url: string;
}