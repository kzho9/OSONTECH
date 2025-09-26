import { PricingPlan } from '@prisma/client';
import { prisma } from '@/config/database';
import { redis } from '@/config/redis';

export class PricingService {
  static async getActivePlans(): Promise<PricingPlan[]> {
    // Try to get from cache first
    const cacheKey = 'pricing_plans:active';
    const cached = await redis.get(cacheKey);
    
    if (cached) {
      return JSON.parse(cached) as PricingPlan[];
    }

    // Get from database
    const plans = await prisma.pricingPlan.findMany({
      where: { is_active: true },
      orderBy: [
        { price: 'asc' },
        { duration_days: 'asc' },
      ],
    });

    // Cache for 1 hour
    await redis.setEx(cacheKey, 60 * 60, JSON.stringify(plans));

    return plans;
  }

  static async getPlanById(id: string): Promise<PricingPlan | null> {
    return await prisma.pricingPlan.findFirst({
      where: { id, is_active: true },
    });
  }

  static async invalidateCache(): Promise<void> {
    await redis.del('pricing_plans:active');
  }
}