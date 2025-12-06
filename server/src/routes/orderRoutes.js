import { Router } from 'express';
import { checkoutOrder, getOrderHistory } from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/checkout', protect, checkoutOrder);
router.get('/history', protect, getOrderHistory);

export default router;
