import prisma from '../config/prismaClient.js';
import { handleInventoryChange, handleItemView } from './pricingService.js';

export const listItems = async ({
  page = 1,
  pageSize = 50,
  minPrice,
  maxPrice,
  search,
} = {}) => {
  const take = Math.min(Math.max(Number(pageSize) || 50, 1), 100);
  const currentPage = Math.max(Number(page) || 1, 1);
  const skip = (currentPage - 1) * take;

  const where = {
    AND: [
      minPrice ? { currentPrice: { gte: Number(minPrice) } } : undefined,
      maxPrice ? { currentPrice: { lte: Number(maxPrice) } } : undefined,
      search
        ? {
            OR: [
              { title: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
            ],
          }
        : undefined,
    ].filter(Boolean),
  };

  const [items, total] = await Promise.all([
    prisma.item.findMany({
      include: { inventory: true },
      orderBy: { createdAt: 'desc' },
      where,
      skip,
      take,
    }),
    prisma.item.count({ where }),
  ]);

  // Optional: trigger view-based pricing on the current page only
  await Promise.all(items.map((item) => handleItemView(item.id)));

  return {
    items,
    total,
    page: currentPage,
    pageSize: take,
    totalPages: Math.ceil(total / take),
  };
};

export const createItem = async ({
  title,
  description,
  basePrice,
  sellerId,
  inventoryQuantity = 0,
}) => {
  const item = await prisma.item.create({
    data: {
      title,
      description,
      basePrice,
      currentPrice: basePrice,
      sellerId,
      inventory: {
        create: {
          quantity: inventoryQuantity,
        },
      },
    },
    include: { inventory: true },
  });

  await handleInventoryChange(item.id);
  return item;
};

export const updateItem = async (itemId, data) => {
  const { inventoryQuantity, ...rest } = data;

  const item = await prisma.item.update({
    where: { id: itemId },
    data: {
      ...rest,
    },
    include: { inventory: true },
  });

  if (typeof inventoryQuantity === 'number') {
    await prisma.inventory.upsert({
      where: { itemId },
      create: { itemId, quantity: inventoryQuantity },
      update: { quantity: inventoryQuantity },
    });
    await handleInventoryChange(itemId);
  }

  return item;
};

export const deleteItem = (itemId) => prisma.item.delete({ where: { id: itemId } });

export const getItemById = (itemId) =>
  prisma.item.findUnique({ where: { id: itemId }, include: { inventory: true } });
