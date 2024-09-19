import { PrismaClient } from '@prisma/client';

export async function seedDepartment(prisma: PrismaClient) {
  await prisma.department.createMany({
    data: [
      { id: 1, name: '클럽하우스' },
      { id: 2, name: '스타트하우스' },
      { id: 3, name: '직원식당' },
      { id: 4, name: '장비관리' },
      { id: 5, name: '카트관리' },
      { id: 6, name: '경영지원' },
      { id: 7, name: '락카/미화' },
      { id: 8, name: '시설관리' },
      { id: 9, name: 'IT' },
      { id: 10, name: '대식당' },
    ],
  });
  return await prisma.department.findMany({
    orderBy: {
      id: 'asc',
    },
  });
}

export async function seedInventoryPlace(prisma: PrismaClient) {
  if ((await prisma.department.count()) === 0) {
    await seedDepartment(prisma);
  }

  const departments = await prisma.department.findMany({
    orderBy: {
      id: 'asc',
    },
  });

  await prisma.inventoryPlace.createMany({
    data: departments.map((department) => ({
      name: department.name,
      departmentId: department.id,
    })),
  });

  return await prisma.inventoryPlace.findMany({
    include: {
      department: true,
    },
    orderBy: {
      id: 'asc',
    },
  });
}
