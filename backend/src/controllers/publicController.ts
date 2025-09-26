import { Request, Response, NextFunction } from 'express';
import { PricingService } from '@/services/pricingService';
import { formatApiResponse } from '@/utils';

export class PublicController {
  static async getPricingPlans(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const plans = await PricingService.getActivePlans();
      
      res.json(
        formatApiResponse(true, plans, 'Pricing plans retrieved successfully')
      );
    } catch (error) {
      next(error);
    }
  }
}