import { Router } from 'express';
import { addCartItem, removeCartItem, getUserCart } from '../controllers/cartController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.use(protect);
router.get('/', getUserCart);
router.post('/add', addCartItem);
router.delete('/remove', removeCartItem);

export default router;
