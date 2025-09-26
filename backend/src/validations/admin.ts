import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  first_name: z.string().min(2, 'First name must be at least 2 characters'),
  last_name: z.string().optional(),
  language: z.enum(['ru', 'uz', 'en']).default('ru'),
});

export const updateUserSchema = z.object({
  email: z.string().email('Invalid email format').optional(),
  first_name: z.string().min(2, 'First name must be at least 2 characters').optional(),
  last_name: z.string().optional(),
  language: z.enum(['ru', 'uz', 'en']).optional(),
});

export const createPricingPlanSchema = z.object({
  name: z.string().min(1, 'Plan name is required'),
  duration_days: z.number().min(1, 'Duration must be at least 1 day'),
  price: z.number().min(0, 'Price must be >= 0'),
  currency: z.string().default('USD'),
  is_active: z.boolean().default(true),
});

export const updatePricingPlanSchema = z.object({
  name: z.string().min(1, 'Plan name is required').optional(),
  duration_days: z.number().min(1, 'Duration must be at least 1 day').optional(),
  price: z.number().min(0, 'Price must be >= 0').optional(),
  currency: z.string().optional(),
  is_active: z.boolean().optional(),
});

export const adminPaginationSchema = z.object({
  page: z.string().transform(val => parseInt(val, 10)).refine(val => val >= 1, 'Page must be >= 1').default('1'),
  limit: z.string().transform(val => parseInt(val, 10)).refine(val => val >= 1 && val <= 100, 'Limit must be between 1 and 100').default('10'),
  search: z.string().optional(),
  status: z.enum(['active', 'expired', 'cancelled']).optional(),
  provider: z.enum(['click', 'payme']).optional(),
});

export const sendNotificationSchema = z.object({
  type: z.enum(['email', 'telegram']),
  recipients: z.array(z.string().email()).min(1, 'At least one recipient is required'),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(1, 'Message is required'),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type CreatePricingPlanInput = z.infer<typeof createPricingPlanSchema>;
export type UpdatePricingPlanInput = z.infer<typeof updatePricingPlanSchema>;
export type AdminPaginationInput = z.infer<typeof adminPaginationSchema>;
export type SendNotificationInput = z.infer<typeof sendNotificationSchema>;