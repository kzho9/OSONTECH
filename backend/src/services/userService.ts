import { User, Subscription, VpnAccount, PaymentLog, PricingPlan } from '@prisma/client';
import { prisma } from '@/config/database';
import { AppError } from '@/utils';
import type { UpdateProfileInput, PaginationInput } from '@/validations/user';
import type { PaginatedResponse } from '@/types';

export class UserService {
  static async getProfile(userId: string): Promise<Omit<User, 'password_hash'>> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        language: true,
        created_at: true,
        updated_at: true,
      },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }

  static async updateProfile(
    userId: string,
    data: UpdateProfileInput
  ): Promise<Omit<User, 'password_hash'>> {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...data,
        updated_at: new Date(),
      },
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        language: true,
        created_at: true,
        updated_at: true,
      },
    });

    return user;
  }

  static async getSubscriptions(
    userId: string,
    pagination: PaginationInput
  ): Promise<PaginatedResponse<Subscription & { vpn_accounts: VpnAccount[] }>> {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    const [subscriptions, total] = await Promise.all([
      prisma.subscription.findMany({
        where: { user_id: userId },
        include: {
          vpn_accounts: true,
        },
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
      }),
      prisma.subscription.count({
        where: { user_id: userId },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: subscriptions,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  static async getVpnConfigs(userId: string): Promise<VpnAccount[]> {
    const vpnAccounts = await prisma.vpnAccount.findMany({
      where: { 
        user_id: userId,
        expires_at: { gt: new Date() }, // Only active accounts
      },
      include: {
        subscription: true,
      },
      orderBy: { created_at: 'desc' },
    });

    // TODO: Generate actual VPN configs from MarzBan
    return vpnAccounts;
  }

  static async getPaymentHistory(
    userId: string,
    pagination: PaginationInput
  ): Promise<PaginatedResponse<PaymentLog>> {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    const [payments, total] = await Promise.all([
      prisma.paymentLog.findMany({
        where: { user_id: userId },
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
      }),
      prisma.paymentLog.count({
        where: { user_id: userId },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: payments,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  static async purchaseSubscription(userId: string, planId: string): Promise<{
    paymentUrl: string;
    paymentId: string;
  }> {
    // Find pricing plan
    const plan = await prisma.pricingPlan.findFirst({
      where: { id: planId, is_active: true },
    });

    if (!plan) {
      throw new AppError('Pricing plan not found', 404);
    }

    // Create payment log
    const paymentLog = await prisma.paymentLog.create({
      data: {
        user_id: userId,
        amount: plan.price,
        currency: plan.currency,
        provider: 'pending', // Will be updated when user selects payment method
        transaction_id: `temp_${Date.now()}`,
        status: 'pending',
      },
    });

    // TODO: Generate actual payment URL from payment provider
    const paymentUrl = `https://payment.example.com/pay/${paymentLog.id}`;

    return {
      paymentUrl,
      paymentId: paymentLog.id,
    };
  }

  static async cancelSubscription(userId: string, subscriptionId: string): Promise<void> {
    const subscription = await prisma.subscription.findFirst({
      where: {
        id: subscriptionId,
        user_id: userId,
      },
    });

    if (!subscription) {
      throw new AppError('Subscription not found', 404);
    }

    if (subscription.status === 'cancelled') {
      throw new AppError('Subscription is already cancelled', 400);
    }

    await prisma.subscription.update({
      where: { id: subscriptionId },
      data: { status: 'cancelled' },
    });

    // TODO: Disable VPN accounts in MarzBan
  }
}