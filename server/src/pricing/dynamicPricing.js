import prisma from '../config/prismaClient.js';

// Constrain movement: floor at 95% of base, cap at 150%
const MIN_MULTIPLIER = 0.95;
const MAX_MULTIPLIER = 1.3;

const roundToCents = (value) => Math.round(value * 100) / 100;

const clampPrice = (price, basePrice) => {
  const min = basePrice * MIN_MULTIPLIER;
  const max = basePrice * MAX_MULTIPLIER;
  return Math.min(Math.max(price, min), max);
};

export const calculateDynamicPrice = (
  currentPrice,
  inventoryLevel,
  demandScore,
  timeFactor,
) => {
  const demandInfluence = 0.08 * demandScore;
  const inventoryInfluence = inventoryLevel <= 0 ? 0.12 : -0.05 * Math.log10(inventoryLevel + 1);
  const temporalInfluence = 0.01 * timeFactor;

  const multiplier = 1 + demandInfluence + inventoryInfluence + temporalInfluence;
  const tentativePrice = currentPrice * multiplier;
  return roundToCents(tentativePrice);
};

const deriveTimeFactor = () => {
  const hour = new Date().getHours();
  if (hour >= 18 && hour <= 22) return 0.3; // evening time
  if (hour >= 9 && hour <= 11) return 0.1; // later morning - noon time
  if (hour >= 0 && hour <= 5) return -0.2; // AM times when no one shops
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
