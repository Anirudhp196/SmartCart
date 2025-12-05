import prisma from '../config/prismaClient.js';

const MIN_MULTIPLIER = 0.85;
const MAX_MULTIPLIER = 1.35;

const roundToCents = (value) => Math.round(value * 100) / 100;

const clampPrice = (price, basePrice) => {
  const min = basePrice * MIN_MULTIPLIER;
  const max = basePrice * MAX_MULTIPLIER;
  return Math.min(Math.max(price, min), max);
};

/**
 * Core pricing function requested in the spec. The four parameters below fully
 * determine the adjustment before persistence occurs.
 */
export const calculateDynamicPrice = (
  currentPrice,
  inventoryLevel,
  demandScore,
  timeFactor,
) => {
  const demandInfluence = 0.05 * demandScore;
  const inventoryInfluence = inventoryLevel <= 0 ? 0.08 : -0.03 * Math.log10(inventoryLevel + 1);
  const temporalInfluence = 0.02 * timeFactor;

  const multiplier = 1 + demandInfluence + inventoryInfluence + temporalInfluence;
  const tentativePrice = currentPrice * multiplier;
  return roundToCents(tentativePrice);
};

const deriveTimeFactor = () => {
  const hour = new Date().getHours();
  if (hour >= 18 && hour <= 22) return 1; // evening rush
  if (hour >= 9 && hour <= 11) return 0.4; // late morning
  if (hour >= 0 && hour <= 5) return -0.6; // off-hours
  return 0;
};

export const applyDynamicPricing = async ({
  itemId,
  inventoryLevel,
  demandScore,
  reason,
}) => {
  const item = await prisma.item.findUnique({
    where: { id: itemId },
    include: { inventory: true },
  });

  if (!item) return null;

  const level = typeof inventoryLevel === 'number'
    ? inventoryLevel
    : item.inventory?.quantity ?? 0;

  const nextPrice = clampPrice(
    calculateDynamicPrice(item.currentPrice, level, demandScore, deriveTimeFactor()),
    item.basePrice,
  );

  if (nextPrice === item.currentPrice) {
    return nextPrice;
  }

  await prisma.$transaction([
    prisma.item.update({
      where: { id: itemId },
      data: { currentPrice: nextPrice },
    }),
    prisma.pricingHistory.create({
      data: {
        itemId,
        price: nextPrice,
        reason,
        metadata: { demandScore, level },
      },
    }),
  ]);

  return nextPrice;
};
