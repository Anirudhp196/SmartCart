import prisma from '../config/prismaClient.js';
import { getCart } from './cartService.js';
import { handleInventoryChange } from './pricingService.js';

export const checkout = async (userId) => {
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      cartItems: {
        include: {
          item: {
            include: { inventory: true },
          },
        },
      },
    },
  });

  if (!cart || cart.cartItems.length === 0) {
    const error = new Error('Cart is empty');
    error.status = 400;
    throw error;
  }

  const total = cart.cartItems.reduce(
    (sum, ci) => sum + ci.item.currentPrice * ci.quantity,
    0,
  );

  const orderItems = cart.cartItems.map((ci) => ({
    itemId: ci.itemId,
    title: ci.item.title,
    quantity: ci.quantity,
    price: ci.item.currentPrice,
  }));

  const order = await prisma.$transaction(async (tx) => {
    const createdOrder = await tx.order.create({
      data: {
        userId,
        total,
        status: 'PAID',
        items: orderItems,
      },
    });

    await Promise.all(
      cart.cartItems.map((ci) =>
        tx.inventory.update({
          where: { itemId: ci.itemId },
          data: {
            quantity: {
              decrement: Math.min(ci.quantity, ci.item.inventory?.quantity ?? ci.quantity),
            },
          },
        }),
      ),
    );

    await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

    return createdOrder;
  });

  await Promise.all(orderItems.map((item) => handleInventoryChange(item.itemId)));

  return {
    order,
    cart: await getCart(userId),
  };
};

export const getOrdersForUser = (userId) =>
  prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
