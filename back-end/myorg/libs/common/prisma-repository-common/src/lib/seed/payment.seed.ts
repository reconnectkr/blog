import { PrismaClient } from '@prisma/client';
import { Decimal } from 'decimal.js';

export async function seedPaymentType(prisma: PrismaClient) {
  await prisma.paymentType.createMany({
    data: [
      { id: 1, name: 'PAYMENT' },
      { id: 2, name: 'CANCEL_PAYMENT' },
      { id: 3, name: 'REFUND' },
      { id: 4, name: 'ADJUSTMENT' },
    ],
  });

  return prisma.paymentType.findMany({ orderBy: { id: 'asc' } });
}

export async function seedPaymentMethod(prisma: PrismaClient) {
  await prisma.paymentMethod.createMany({
    data: [
      { id: 1, name: 'CASH' },
      { id: 2, name: 'CREDIT_CARD' },
      { id: 3, name: 'CHECK_CARD' },
      { id: 4, name: 'BANK_TRANSFER' },
      { id: 5, name: 'COUPON' },
      { id: 6, name: 'POINT' },
    ],
  });

  return prisma.paymentMethod.findMany({ orderBy: { id: 'asc' } });
}

export async function seedPaymentTiming(prisma: PrismaClient) {
  await prisma.paymentTiming.createMany({
    data: [
      { id: 1, name: 'PREPAID' },
      { id: 2, name: 'POSTPAID' },
    ],
  });

  return prisma.paymentTiming.findMany({ orderBy: { id: 'asc' } });
}

export async function seedPriceAdjustmentType(prisma: PrismaClient) {
  await prisma.priceAdjustmentType.createMany({
    data: [
      { id: 1, name: 'DISCOUNT_FIXED_AMOUNT' },
      { id: 2, name: 'DISCOUNT_RATE' },
      { id: 3, name: 'TAX_FIXED_AMOUNT' },
      { id: 4, name: 'TAX_RATE' },
    ],
  });

  return prisma.priceAdjustmentType.findMany({ orderBy: { id: 'asc' } });
}

export async function seedPriceAdjustmentPolicy(prisma: PrismaClient) {
  if ((await prisma.priceAdjustmentType.count()) === 0) {
    await seedPriceAdjustmentType(prisma);
  }

  const user = await prisma.user.findFirstOrThrow();

  await prisma.priceAdjustmentPolicy.createMany({
    data: [
      {
        id: 1,
        name: 'VALUE_ADDED_TAX',
        typeId: 3,
        adjustmentRate: new Decimal(0.1),
        createdBy: user.id,
        updatedBy: user.id,
      },
      {
        id: 2,
        name: 'EARLY_BIRD_DISCOUNT',
        typeId: 2,
        adjustmentRate: new Decimal(0.15),
        createdBy: user.id,
        updatedBy: user.id,
      },
      {
        id: 3,
        name: 'SENIOR_DISCOUNT',
        typeId: 1,
        adjustmentAmount: new Decimal(5000),
        createdBy: user.id,
        updatedBy: user.id,
      },
      {
        id: 4,
        name: 'LUXURY_TAX',
        typeId: 4,
        adjustmentRate: new Decimal(0.05),
        createdBy: user.id,
        updatedBy: user.id,
      },
    ],
  });
}

export async function seedPriceAdjustable(prisma: PrismaClient) {
  await prisma.priceAdjustable.createMany({
    data: [
      {
        id: 1,
        name: 'Order',
      },
      {
        id: 2,
        name: 'OrderItem',
      },
      {
        id: 3,
        name: 'Invoice',
      },
      {
        id: 4,
        name: 'InvoiceItem',
      },
    ],
  });
  return await prisma.priceAdjustable.findMany({ orderBy: { id: 'asc' } });
}
