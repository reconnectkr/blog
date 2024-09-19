import { Coupon, PrismaClient } from '@prisma/client';
import { seedUser } from '@reconnect/prisma-repository-common';
import { Decimal } from 'decimal.js';
import { DateTime } from 'luxon';

export async function deleteTestFixtures(prisma: PrismaClient) {
  await prisma.coupon.deleteMany();
  await prisma.user.deleteMany();
}

export async function createTestFixtures(
  prisma: PrismaClient
): Promise<Coupon[]> {
  await seedUser(prisma);
  const users = await prisma.user.findMany();

  const now = DateTime.now();

  const coupons: Omit<Coupon, 'id'>[] = [
    {
      code: 'COUPON1',
      issuedBy: users[0].id,
      issuedAt: now.toJSDate(),
      expiredAt: now.plus({ days: 30 }).toJSDate(),
      price: new Decimal(100.0),
      rate: null,
      retrievedAt: null,
      retrievedBy: null,
    },
    {
      code: 'COUPON2',
      issuedBy: users[1].id,
      issuedAt: now.minus({ days: 5 }).toJSDate(),
      expiredAt: now.plus({ days: 25 }).toJSDate(),
      price: null,
      rate: new Decimal(0.15),
      retrievedAt: null,
      retrievedBy: null,
    },
    {
      code: 'COUPON3',
      issuedBy: users[0].id,
      issuedAt: now.minus({ days: 10 }).toJSDate(),
      expiredAt: now.plus({ days: 20 }).toJSDate(),

      price: new Decimal(50.0),
      rate: null,
      retrievedAt: now.minus({ days: 1 }).toJSDate(),
      retrievedBy: users[2].id,
    },
    {
      code: 'COUPON4',
      issuedBy: users[1].id,
      issuedAt: now.minus({ days: 15 }).toJSDate(),
      expiredAt: now.plus({ days: 15 }).toJSDate(),
      price: null,
      rate: new Decimal(0.25),
      retrievedAt: null,
      retrievedBy: null,
    },
    {
      code: 'COUPON5',
      issuedBy: users[0].id,
      issuedAt: now.minus({ days: 20 }).toJSDate(),
      expiredAt: now.plus({ days: 10 }).toJSDate(),
      price: new Decimal(75.0),
      rate: null,
      retrievedAt: null,
      retrievedBy: null,
    },
  ];

  await prisma.coupon.createMany({
    data: coupons,
  });

  return prisma.coupon.findMany({ orderBy: { id: 'asc' } });
}
