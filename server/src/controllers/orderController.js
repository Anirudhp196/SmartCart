import { checkout } from '../services/orderService.js';

export const checkoutOrder = async (req, res, next) => {
  try {
    const payload = await checkout(req.user.id);
    res.status(201).json(payload);
  } catch (error) {
    next(error);
  }
};
