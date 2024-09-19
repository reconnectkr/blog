import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

export const password = 'password';

export async function seedUser(prisma: PrismaClient) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const users = [
    {
      id: '1',
      email: 'admin@example.com',
      username: 'admin',
      password: hashedPassword,
    },
    {
      id: '2',
      email: 'marketing@example.com',
      username: 'marketing',
      password: hashedPassword,
    },
    {
      id: '3',
      email: 'test-user3@example.com',
      username: 'test-user3',
      password: hashedPassword,
    },
  ];

  await prisma.user.createMany({
    data: users,
  });

  await prisma.profile.createMany({
    data: [
      {
        userId: users[0].id,
        name: '관리자',
        mobile: '010-0001-0001',
      },
      {
        userId: users[1].id,
        name: '마케팅',
        mobile: '010-0002-0002',
      },
      {
        userId: users[2].id,
        name: '테스터3',
        mobile: '010-0003-0003',
      },
    ],
  });

  return await prisma.user.findMany({
    include: {
      profile: true,
    },
    orderBy: {
      id: 'asc',
    },
  });
}
