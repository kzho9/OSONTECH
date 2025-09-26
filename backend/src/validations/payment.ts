import { z } from 'zod';

export const createPaymentSchema = z.object({
  plan_id: z.string().cuid('Invalid plan ID'),
  provider: z.enum(['click', 'payme']),
  return_url: z.string().url('Invalid return URL').optional(),
});

export const clickWebhookSchema = z.object({
  click_trans_id: z.number(),
  service_id: z.number(),
  click_paydoc_id: z.number(),
  merchant_trans_id: z.string(),
  amount: z.number().positive(),
  action: z.number(),
  error: z.number(),
  error_note: z.string(),
  sign_time: z.string(),
  sign_string: z.string(),
});

export const paymeWebhookSchema = z.object({
  method: z.string(),
  params: z.object({
    id: z.string().optional(),
    time: z.number().optional(),
    amount: z.number().optional(),
    account: z.object({
      subscription_id: z.string(),
    }).optional(),
    reason: z.number().optional(),
  }),
});

export const verifyPaymentSchema = z.object({
  transaction_id: z.string().min(1, 'Transaction ID is required'),
  provider: z.enum(['click', 'payme']),
});

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
export type ClickWebhookInput = z.infer<typeof clickWebhookSchema>;
export type PaymeWebhookInput = z.infer<typeof paymeWebhookSchema>;
export type VerifyPaymentInput = z.infer<typeof verifyPaymentSchema>;