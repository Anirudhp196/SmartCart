import dotenv from 'dotenv';
import prisma from '../src/config/prismaClient.js';

dotenv.config();

async function main() {
  const items = await prisma.item.findMany({ select: { id: true, title: true } });
  const titleById = new Map(items.map((it) => [it.id, it.title]));

  const orders = await prisma.order.findMany({ select: { id: true, items: true } });
  console.log(`Found ${orders.length} orders to check.`);

  let updated = 0;
  for (const order of orders) {
    const nextItems = (order.items || []).map((entry) => {
      const title = entry.title || titleById.get(entry.itemId) || entry.itemId;
      return { ...entry, title };
    });

    // If nothing changed, skip update
    const changed = JSON.stringify(nextItems) !== JSON.stringify(order.items || []);
    if (!changed) continue;

    await prisma.order.update({
      where: { id: order.id },
      data: { items: nextItems },
    });
    updated += 1;
  }

  console.log(`Updated ${updated} orders with titles.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
