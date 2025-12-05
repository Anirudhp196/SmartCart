import prisma from '../config/prismaClient.js';
import { applyDynamicPricing } from '../pricing/dynamicPricing.js';

const computeDemandScore = (item) => {
  const viewsComponent = (item.views || 0) * 0.01;
  const cartComponent = (item.cartAdds || 0) * 0.05;
  return Number((viewsComponent + cartComponent).toFixed(4));
};

const recalc = async (item, reason) => {
  const inventoryLevel = item.inventory?.quantity ?? 0;
  const demandScore = computeDemandScore(item);
  return applyDynamicPricing({
    itemId: item.id,
    inventoryLevel,
    demandScore,
    reason,
  });
};

export const handleItemView = async (itemId) => {
  const item = await prisma.item.update({
    where: { id: itemId },
    data: { views: { increment: 1 } },
    include: { inventory: true },
  });

  await recalc(item, 'view');
};

export const handleCartAdd = async (itemId) => {
  const item = await prisma.item.update({
    where: { id: itemId },
    data: { cartAdds: { increment: 1 } },
    include: { inventory: true },
  });

  await recalc(item, 'cart-add');
};

export const handleInventoryChange = async (itemId) => {
  const item = await prisma.item.findUnique({
    where: { id: itemId },
    include: { inventory: true },
  });

  if (!item) return;
  await recalc(item, 'inventory-change');
};

export const getPricingHistory = async (itemId) =>
  prisma.pricingHistory.findMany({
    where: { itemId },
    orderBy: { createdAt: 'desc' },
    take: 25,
  });
