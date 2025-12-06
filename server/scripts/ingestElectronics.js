import dotenv from 'dotenv';
import prisma from '../src/config/prismaClient.js';

dotenv.config();

const IMPORT_SELLER_EMAIL = process.env.IMPORT_SELLER_EMAIL || 'importer@smartcart.dev';
const IMPORT_SELLER_PASSWORD = process.env.IMPORT_SELLER_PASSWORD || 'changeme123!';
const STAGING_SCHEMA = process.env.STAGING_SCHEMA || 'public';
const STAGING_TABLE = process.env.STAGING_TABLE || 'electronics';

const cleanupNumber = (value) => {
  if (!value) return 0;
  const numeric = `${value}`.replace(/[^0-9.-]/g, '');
  return Number(numeric) || 0;
};

const cleanupPrice = (value) => {
  const price = cleanupNumber(value);
  return price > 0 ? price : null;
};

const deriveInventory = (ratingCount) => {
  const qty = Math.max(5, Math.min(500, Math.round(ratingCount / 50)));
  return qty || 20;
};

const ensureSellerAccount = async () => {
  const existing = await prisma.user.findUnique({ where: { email: IMPORT_SELLER_EMAIL } });
  if (existing) return existing;

  const bcryptModule = await import('bcryptjs');
  const bcrypt = bcryptModule.default || bcryptModule;
  const password = await bcrypt.hash(IMPORT_SELLER_PASSWORD, 10);

  return prisma.user.create({
    data: {
      email: IMPORT_SELLER_EMAIL,
      password,
      role: 'SELLER',
      name: 'SmartCart Imports',
    },
  });
};

const main = async () => {
  console.log('Starting electronics import...');
  const seller = await ensureSellerAccount();
  console.log(`Using seller ${seller.email} (${seller.id})`);

  const rows = await prisma.$queryRawUnsafe(`SELECT * FROM "${STAGING_SCHEMA}"."${STAGING_TABLE}"`);
  console.log(`Found ${rows.length} staging rows from ${STAGING_SCHEMA}.${STAGING_TABLE}.`);
  if (rows.length && rows[0]) {
    console.log('Sample keys:', Object.keys(rows[0]).join(', '));
  }
  if (rows.length === 0) {
    console.log('No rows to import. Verify STAGING_SCHEMA/STAGING_TABLE and that the table has data.');
    return;
  }

  let importedCount = 0;
  let skippedMissingPrice = 0;
  let skippedNoTitle = 0;
  let skippedDuplicate = 0;

  for (const row of rows) {
    const title = row.name?.trim();
    if (!title) {
      skippedNoTitle += 1;
      continue;
    }

    // CSV columns: discount_price (current) and actual_price (original)
    const price = cleanupPrice(row.discount_price) || cleanupPrice(row.actual_price);
    if (!price) {
      skippedMissingPrice += 1;
      continue;
    }

  const rating = Number(row.ratings) || 0;
  const ratingCount = cleanupNumber(row.no_of_ratings);

    const existing = await prisma.item.findFirst({ where: { title } });
    if (existing) {
      skippedDuplicate += 1;
      continue;
    }

    const demandProxy = cleanupNumber(row.rating_count || row.no_of_ratings);
    const inventoryQuantity = deriveInventory(demandProxy);

    const item = await prisma.item.create({
      data: {
        title,
        description: `${row.main_category || ''} | ${row.sub_category || ''}`.trim(),
        basePrice: price,
        currentPrice: price,
        rating,
        ratingCount,
        sellerId: seller.id,
        views: demandProxy,
        inventory: {
          create: {
            quantity: inventoryQuantity,
          },
        },
      },
    });

    await prisma.pricingHistory.create({
      data: {
        itemId: item.id,
        price,
        reason: 'initial-import',
        metadata: {
          ratings: row.ratings,
          ratingCount: demandProxy,
          source: row.link,
        },
      },
    });

    importedCount += 1;
  }

  console.log(`Imported ${importedCount} new items.`);
  console.log(`Skipped - missing price: ${skippedMissingPrice}, no title: ${skippedNoTitle}, duplicate title: ${skippedDuplicate}`);
};

main()
  .catch((error) => {
    console.error('Import failed', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
