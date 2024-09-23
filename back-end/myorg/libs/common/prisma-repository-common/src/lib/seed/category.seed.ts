import { PrismaClient } from '@prisma/client';

export async function seedCategory(prisma: PrismaClient) {
  await prisma.category.createMany({
    data: [
      { id: 1, name: '기술' },
      { id: 2, name: '여행' },
      { id: 3, name: '요리' },
      { id: 4, name: '건강' },
      { id: 5, name: '취미' },
      { id: 6, name: '경제' },
      { id: 7, name: '문화' },
      { id: 8, name: '스포츠' },
      { id: 9, name: '교육' },
      { id: 10, name: '환경' },
    ],
  });
  return await prisma.category.findMany({
    orderBy: {
      id: 'asc',
    },
  });
}
