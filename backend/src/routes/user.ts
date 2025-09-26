import { Router } from 'express';
import { UserController } from '@/controllers/userController';
import { authenticate } from '@/middleware/auth';
import { validateBody, validateQuery } from '@/middleware/validation';
import {
  updateProfileSchema,
  purchaseSubscriptionSchema,
  paginationSchema,
} from '@/validations/user';

const router = Router();

// All user routes require authentication
router.use(authenticate);

// Profile routes
router.get('/profile', UserController.getProfile);
router.put('/profile', validateBody(updateProfileSchema), UserController.updateProfile);

// Subscription routes
router.get('/subscriptions', validateQuery(paginationSchema), UserController.getSubscriptions);
router.post('/subscriptions/purchase', validateBody(purchaseSubscriptionSchema), UserController.purchaseSubscription);
router.put('/subscriptions/:id/cancel', UserController.cancelSubscription);

// VPN routes
router.get('/vpn-configs', UserController.getVpnConfigs);

// Payment routes
router.get('/payments', validateQuery(paginationSchema), UserController.getPaymentHistory);

export default router;