import { PrismaClient, User } from '@prisma/client';

export async function seedCoupon(prisma: PrismaClient) {
  const users: User[] = await prisma.user.findMany();

  await prisma.coupon.createMany({
    data: [
      {
        code: 'WELCOME10',
        issuedBy: users[0].id,
        issuedAt: new Date(),
        expiredAt: new Date(
          new Date().setFullYear(new Date().getFullYear() + 1)
        ),
        price: 10000,
        rate: 0.1,
      },
      {
        code: 'SUMMER20',
        issuedBy: users[1].id,
        issuedAt: new Date(),
        expiredAt: new Date(new Date().setMonth(new Date().getMonth() + 3)),
        price: null,
        rate: 0.2,
      },
      {
        code: 'FIXED5000',
        issuedBy: users[0].id,
        issuedAt: new Date(),
        expiredAt: new Date(new Date().setMonth(new Date().getMonth() + 6)),
        price: 5000,
        rate: null,
      },
    ],
  });

  console.log('Coupons seeded successfully');
}
