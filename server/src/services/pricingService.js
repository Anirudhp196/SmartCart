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

  // On view without purchase, gently mark down to entice conversion
  const next = Math.max(
    item.basePrice * 0.5, // floor at 50% of base
    Math.round(item.currentPrice * 0.95 * 100) / 100, // 5% drop
  );

  if (next < item.currentPrice) {
    await prisma.$transaction([
      prisma.item.update({
        where: { id: itemId },
        data: { currentPrice: next },
      }),
      prisma.pricingHistory.create({
        data: {
          itemId,
          price: next,
          reason: 'view-decay',
          metadata: { from: item.currentPrice, factor: 0.95 },
        },
      }),
    ]);
  }
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

// --- Price decay for idle items (moderate) ---
const DECAY_INTERVAL_MS = 600000; // every 10 minutes
const DECAY_IDLE_MS = 600000; // idle for 10 minutes before decay
const DECAY_FACTOR = 0.98; // drop ~2% per decay tick
const DECAY_MIN_MULT = 0.95; // never below 95% of basePrice

const applyDecayToItem = async (item) => {
  const floor = item.basePrice * DECAY_MIN_MULT;
  const next = Math.max(floor, Math.round(item.currentPrice * DECAY_FACTOR * 100) / 100);
  if (next >= item.currentPrice) return false;

  await prisma.$transaction([
    prisma.item.update({
      where: { id: item.id },
      data: { currentPrice: next },
    }),
    prisma.pricingHistory.create({
      data: {
        itemId: item.id,
        price: next,
        reason: 'decay',
        metadata: { from: item.currentPrice, factor: DECAY_FACTOR },
      },
    }),
  ]);
  return true;
};

export const runPriceDecayTick = async () => {
  const cutoff = new Date(Date.now() - DECAY_IDLE_MS);
  const candidates = await prisma.item.findMany({
    where: { updatedAt: { lt: cutoff } },
    select: { id: true, basePrice: true, currentPrice: true },
    orderBy: { updatedAt: 'asc' },
    take: 200, // limit per tick
  });

  let changed = 0;
  for (const item of candidates) {
    const updated = await applyDecayToItem(item);
    if (updated) changed += 1;
  }
  return changed;
};

let decayTimer = null;
export const startPriceDecayScheduler = () => {
  if (decayTimer) return;
  decayTimer = setInterval(() => {
    runPriceDecayTick().catch((err) => console.error('price decay tick failed', err));
  }, DECAY_INTERVAL_MS);
};
