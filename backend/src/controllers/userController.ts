import { Response, NextFunction } from 'express';
import { UserService } from '@/services/userService';
import { formatApiResponse } from '@/utils';
import type { AuthRequest } from '@/types';
import type { UpdateProfileInput, PaginationInput, PurchaseSubscriptionInput, CancelSubscriptionInput } from '@/validations/user';

export class UserController {
  static async getProfile(
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

      const profile = await UserService.getProfile(userId);
      
      res.json(
        formatApiResponse(true, profile, 'Profile retrieved successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  static async updateProfile(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.userId;
      const data: UpdateProfileInput = req.body;
      
      if (!userId) {
        res.status(401).json(
          formatApiResponse(false, null, 'User not authenticated')
        );
        return;
      }

      const profile = await UserService.updateProfile(userId, data);
      
      res.json(
        formatApiResponse(true, profile, 'Profile updated successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  static async getSubscriptions(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.userId;
      const pagination = req.query as unknown as PaginationInput;
      
      if (!userId) {
        res.status(401).json(
          formatApiResponse(false, null, 'User not authenticated')
        );
        return;
      }

      const subscriptions = await UserService.getSubscriptions(userId, pagination);
      
      res.json(
        formatApiResponse(true, subscriptions, 'Subscriptions retrieved successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  static async getVpnConfigs(
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

      const vpnConfigs = await UserService.getVpnConfigs(userId);
      
      res.json(
        formatApiResponse(true, vpnConfigs, 'VPN configurations retrieved successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  static async getPaymentHistory(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.userId;
      const pagination = req.query as unknown as PaginationInput;
      
      if (!userId) {
        res.status(401).json(
          formatApiResponse(false, null, 'User not authenticated')
        );
        return;
      }

      const payments = await UserService.getPaymentHistory(userId, pagination);
      
      res.json(
        formatApiResponse(true, payments, 'Payment history retrieved successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  static async purchaseSubscription(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.userId;
      const data: PurchaseSubscriptionInput = req.body;
      
      if (!userId) {
        res.status(401).json(
          formatApiResponse(false, null, 'User not authenticated')
        );
        return;
      }

      const result = await UserService.purchaseSubscription(userId, data.plan_id);
      
      res.json(
        formatApiResponse(true, result, 'Payment initiated successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  static async cancelSubscription(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.userId;
      const { id } = req.params;
      
      if (!userId) {
        res.status(401).json(
          formatApiResponse(false, null, 'User not authenticated')
        );
        return;
      }

      await UserService.cancelSubscription(userId, id);
      
      res.json(
        formatApiResponse(true, null, 'Subscription cancelled successfully')
      );
    } catch (error) {
      next(error);
    }
  }
}