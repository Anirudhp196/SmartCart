import { checkout } from '../services/orderService.js';
import { getOrdersForUser } from '../services/orderService.js';

export const checkoutOrder = async (req, res, next) => {
  try {
    const payload = await checkout(req.user.id);
    res.status(201).json(payload);
  } catch (error) {
    next(error);
  }
};

export const getOrderHistory = async (req, res, next) => {
  try {
    const orders = await getOrdersForUser(req.user.id);
    res.json(orders);
  } catch (error) {
    next(error);
  }
};
