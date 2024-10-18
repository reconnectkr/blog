import { PrismaClient } from '@prisma/client';
import {
  seedLocker,
  seedLockerAction,
  seedLockerActionLog,
  seedLockerRoom,
} from './locker.seed';

export * from './category.seed';
export * from './coupon.seed';
export * from './department.seed';
export * from './inventory.seed';
export * from './payment.seed';
export * from './point-of-sale.seed';
export * from './post.seed';
export * from './product.seed';
export * from './unit.seed';
export * from './user.seed';

export async function seed(prisma: PrismaClient) {
  await seedLockerAction(prisma);
  await seedLockerRoom(prisma);
  await seedLocker(prisma);
  await seedLockerActionLog(prisma);
}
