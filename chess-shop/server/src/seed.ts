import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

dotenv.config();
const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@kambohandicrafts.test';
  const passwordHash = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: { email: adminEmail, passwordHash, name: 'Admin', isAdmin: true },
  });

  const classic = await prisma.category.upsert({
    where: { name: 'Classic' },
    update: {},
    create: { name: 'Classic' },
  });
  const magnetic = await prisma.category.upsert({
    where: { name: 'Magnetic' },
    update: {},
    create: { name: 'Magnetic' },
  });

  await prisma.product.createMany({
    data: [
      {
        name: 'Wooden Chess Set 12-inch',
        description: 'Handmade wooden chess set',
        priceCents: 4999,
        stock: 10,
        isMagnetic: false,
        isRound: false,
        isFolding: true,
        sizeInches: 12,
        categoryId: classic.id,
      },
      {
        name: 'Magnetic Travel Chess 8-inch',
        description: 'Compact magnetic chess set',
        priceCents: 2999,
        stock: 25,
        isMagnetic: true,
        isRound: false,
        isFolding: true,
        sizeInches: 8,
        categoryId: magnetic.id,
      },
    ],
  });

  console.log('Seed complete. Admin:', admin.email);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});