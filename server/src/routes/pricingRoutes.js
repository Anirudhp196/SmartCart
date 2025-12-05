import { Router } from 'express';
import { fetchPricingHistory, fetchPricingInsight } from '../controllers/pricingController.js';
import { protect, requireSeller } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/history/:itemId', fetchPricingHistory);
router.get('/insights/:itemId', protect, requireSeller, fetchPricingInsight);

export default router;
