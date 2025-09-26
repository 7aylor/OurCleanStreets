import { PrismaClient } from '@prisma/client';

export const getPrismaClient = () => {
  return new PrismaClient({
    datasources: { db: { url: process.env.OCS_DB } },
  });
};
