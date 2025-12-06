import { Router } from 'express';
import { getItems, postItem, putItem, removeItem, viewItemAndReprice } from '../controllers/itemController.js';
import { protect, requireSeller } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', getItems);
router.post('/', protect, requireSeller, postItem);
router.put('/:id', protect, requireSeller, putItem);
router.delete('/:id', protect, requireSeller, removeItem);
router.post('/:id/view', viewItemAndReprice);

export default router;
