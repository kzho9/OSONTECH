import { Router } from 'express';
import { PublicController } from '@/controllers/publicController';

const router = Router();

// Public routes (no authentication required)
router.get('/pricing-plans', PublicController.getPricingPlans);

export default router;