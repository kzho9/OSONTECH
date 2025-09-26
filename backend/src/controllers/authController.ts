import { Response, NextFunction } from 'express';
import { AuthService } from '@/services/authService';
import { formatApiResponse } from '@/utils';
import type { AuthRequest } from '@/types';
import type {
  RegisterInput,
  LoginInput,
  RefreshTokenInput,
  ForgotPasswordInput,
  ResetPasswordInput,
} from '@/validations/auth';

export class AuthController {
  static async register(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const data: RegisterInput = req.body;
      const result = await AuthService.register(data);
      
      res.status(201).json(
        formatApiResponse(true, result, 'User registered successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  static async login(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const data: LoginInput = req.body;
      const result = await AuthService.login(data);
      
      res.json(
        formatApiResponse(true, result, 'Login successful')
      );
    } catch (error) {
      next(error);
    }
  }

  static async refreshToken(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const data: RefreshTokenInput = req.body;
      const result = await AuthService.refreshToken(data.refresh_token);
      
      res.json(
        formatApiResponse(true, result, 'Token refreshed successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  static async logout(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.userId;
      
      if (!userId) {
        res.status(401).json(
          formatApiResponse(false, null, 'User not authenticated')
        );
        return;
      }

      await AuthService.logout(userId);
      
      res.json(
        formatApiResponse(true, null, 'Logout successful')
      );
    } catch (error) {
      next(error);
    }
  }

  static async forgotPassword(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const data: ForgotPasswordInput = req.body;
      await AuthService.forgotPassword(data.email);
      
      res.json(
        formatApiResponse(true, null, 'If email exists, reset instructions have been sent')
      );
    } catch (error) {
      next(error);
    }
  }

  static async resetPassword(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const data: ResetPasswordInput = req.body;
      await AuthService.resetPassword(data.token, data.password);
      
      res.json(
        formatApiResponse(true, null, 'Password reset successful')
      );
    } catch (error) {
      next(error);
    }
  }
}