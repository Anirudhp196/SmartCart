import { addToCart, removeFromCart, getCart } from '../services/cartService.js';

export const getUserCart = async (req, res, next) => {
  try {
    const cart = await getCart(req.user.id);
    res.json(cart);
  } catch (error) {
    next(error);
  }
};

export const addCartItem = async (req, res, next) => {
  try {
    const { itemId, quantity = 1 } = req.body;
    const cart = await addToCart({ userId: req.user.id, itemId, quantity });
    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
};

export const removeCartItem = async (req, res, next) => {
  try {
    const { itemId } = req.body;
    const cart = await removeFromCart({ userId: req.user.id, itemId });
    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
};
