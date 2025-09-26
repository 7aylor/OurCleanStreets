const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  await prisma.$connect();
  console.log('Prisma client keys:', Object.getOwnPropertyNames(prisma).sort());
  await prisma.$disconnect();
})();
