import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.string().default('development'),
  PORT: z.string().default('3001'),
  DATABASE_URL: z.string(),
  REDIS_URL: z.string().optional(),
  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  SENTRY_DSN: z.string().optional(),
  EMAIL_FROM: z.string(),
  EMAIL_HOST: z.string(),
  EMAIL_PORT: z.string(),
  EMAIL_USER: z.string(),
  EMAIL_PASS: z.string(),
  TELEGRAM_BOT_TOKEN: z.string().optional(),
  TELEGRAM_CHAT_ID: z.string().optional(),
  MARZBAN_BASE_URL: z.string(),
  MARZBAN_USERNAME: z.string(),
  MARZBAN_PASSWORD: z.string(),
  CLICK_MERCHANT_ID: z.string().optional(),
  CLICK_SECRET_KEY: z.string().optional(),
  PAYME_MERCHANT_ID: z.string().optional(),
  PAYME_SECRET_KEY: z.string().optional(),
});

const env = envSchema.parse(process.env);

export const config = {
  app: {
    env: env.NODE_ENV,
    port: parseInt(env.PORT, 10),
  },
  database: {
    url: env.DATABASE_URL,
  },
  redis: {
    url: env.REDIS_URL || 'redis://localhost:6379',
  },
  jwt: {
    secret: env.JWT_SECRET,
    expiresIn: env.JWT_EXPIRES_IN,
    refreshExpiresIn: env.JWT_REFRESH_EXPIRES_IN,
  },
  sentry: {
    dsn: env.SENTRY_DSN,
  },
  email: {
    from: env.EMAIL_FROM,
    host: env.EMAIL_HOST,
    port: parseInt(env.EMAIL_PORT, 10),
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASS,
  },
  telegram: {
    botToken: env.TELEGRAM_BOT_TOKEN,
    chatId: env.TELEGRAM_CHAT_ID,
  },
  marzban: {
    baseUrl: env.MARZBAN_BASE_URL,
    username: env.MARZBAN_USERNAME,
    password: env.MARZBAN_PASSWORD,
  },
  payments: {
    click: {
      merchantId: env.CLICK_MERCHANT_ID,
      secretKey: env.CLICK_SECRET_KEY,
    },
    payme: {
      merchantId: env.PAYME_MERCHANT_ID,
      secretKey: env.PAYME_SECRET_KEY,
    },
  },
};