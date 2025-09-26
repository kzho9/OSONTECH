import { Router } from 'express';
import { AuthController } from '@/controllers/authController';
import { authenticate } from '@/middleware/auth';
import { validateBody } from '@/middleware/validation';
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '@/validations/auth';

const router = Router();

// Public routes
router.post('/register', validateBody(registerSchema), AuthController.register);
router.post('/login', validateBody(loginSchema), AuthController.login);
router.post('/refresh', validateBody(refreshTokenSchema), AuthController.refreshToken);
router.post('/forgot-password', validateBody(forgotPasswordSchema), AuthController.forgotPassword);
router.post('/reset-password', validateBody(resetPasswordSchema), AuthController.resetPassword);

// Protected routes
router.post('/logout', authenticate, AuthController.logout);

export default router;