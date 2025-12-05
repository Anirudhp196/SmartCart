import { Router } from 'express';
import { checkoutOrder } from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/checkout', protect, checkoutOrder);

export default router;
