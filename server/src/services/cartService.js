import prisma from '../config/prismaClient.js';
import { handleCartAdd } from './pricingService.js';

const cartInclude = {
  cartItems: {
    include: {
      item: {
        include: { inventory: true },
      },
    },
  },
};

const getOrCreateCart = async (userId) => {
  const existing = await prisma.cart.findUnique({ where: { userId } });
  if (existing) return existing;
  return prisma.cart.create({ data: { userId } });
};

export const getCart = async (userId) => {
  await getOrCreateCart(userId);
  const cart = await prisma.cart.findUnique({ where: { userId }, include: cartInclude });
  if (!cart) return cart;
  const total = cart.cartItems.reduce(
    (sum, ci) => sum + (ci.lockedPrice ?? ci.item.currentPrice) * ci.quantity,
    0,
  );
  return { ...cart, total };
};

export const addToCart = async ({ userId, itemId, quantity }) => {
  const cart = await getOrCreateCart(userId);

  const normalizedQuantity = Number(quantity) || 1;

  if (normalizedQuantity <= 0) {
    const error = new Error('Quantity must be positive');
    error.status = 400;
    throw error;
  }

  const item = await prisma.item.findUnique({ where: { id: itemId } });
  if (!item) {
    const error = new Error('Item not found');
    error.status = 404;
    throw error;
  }

  await prisma.cartItem.upsert({
    where: {
      cartId_itemId: { cartId: cart.id, itemId },
    },
    create: {
      cartId: cart.id,
      itemId,
      quantity: normalizedQuantity,
      lockedPrice: item.currentPrice,
    },
    update: {
      quantity: { increment: normalizedQuantity },
    },
  });

  await handleCartAdd(itemId);
  return getCart(userId);
};

export const removeFromCart = async ({ userId, itemId }) => {
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) return getCart(userId);

  await prisma.cartItem.deleteMany({
    where: {
      cartId: cart.id,
      itemId,
    },
  });

  return getCart(userId);
};
