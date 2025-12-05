import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'].filter(() => process.env.NODE_ENV !== 'production'),
});

export default prisma;
