import { PrismaClient } from '@prisma/client';

// Prisma client singleton to avoid flooding the connection pool
let prisma: PrismaClient;

export const getPrismaClient = () => {
  if (!prisma) {
    prisma = new PrismaClient({
      datasources: { db: { url: process.env.OCS_DB } },
      log: ['error', 'warn'],
    });
  }
  return prisma;
};
