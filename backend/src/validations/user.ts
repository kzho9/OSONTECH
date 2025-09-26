import { z } from 'zod';

export const updateProfileSchema = z.object({
  first_name: z.string().min(2, 'First name must be at least 2 characters').optional(),
  last_name: z.string().optional(),
  language: z.enum(['ru', 'uz', 'en']).optional(),
});

export const purchaseSubscriptionSchema = z.object({
  plan_id: z.string().cuid('Invalid plan ID'),
  provider: z.enum(['click', 'payme']),
});

export const cancelSubscriptionSchema = z.object({
  id: z.string().cuid('Invalid subscription ID'),
});

export const paginationSchema = z.object({
  page: z.string().transform(val => parseInt(val, 10)).refine(val => val >= 1, 'Page must be >= 1').default('1'),
  limit: z.string().transform(val => parseInt(val, 10)).refine(val => val >= 1 && val <= 100, 'Limit must be between 1 and 100').default('10'),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type PurchaseSubscriptionInput = z.infer<typeof purchaseSubscriptionSchema>;
export type CancelSubscriptionInput = z.infer<typeof cancelSubscriptionSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;