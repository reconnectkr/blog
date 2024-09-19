import { PrismaClient } from '@prisma/client';
import { seedDepartment } from './department.seed';
import { seedProduct } from './product.seed';

export async function seedPointOfSale(prisma: PrismaClient) {
  if ((await prisma.department.count()) === 0) {
    await seedDepartment(prisma);
  }

  const departments = await prisma.department.findMany({
    orderBy: {
      id: 'asc',
    },
  });

  const user = await prisma.user.findFirstOrThrow();
  await prisma.pointOfSale.createMany({
    data: departments.map((department) => ({
      name: department.name,
      departmentId: department.id,
      createdBy: user.id,
      updatedBy: user.id,
    })),
  });

  return await prisma.pointOfSale.findMany({
    include: {
      department: true,
    },
    orderBy: {
      id: 'asc',
    },
  });
}

export async function seedPointOfSaleProduct(prisma: PrismaClient) {
  if ((await prisma.pointOfSale.count()) === 0) {
    await seedPointOfSale(prisma);
  }

  const pointOfSales = await prisma.pointOfSale.findMany({
    orderBy: {
      id: 'asc',
    },
  });

  if ((await prisma.product.count()) === 0) {
    await seedProduct(prisma);
  }

  const products = await prisma.product.findMany({
    orderBy: {
      id: 'asc',
    },
  });

  const user = await prisma.user.findFirstOrThrow();

  await prisma.pointOfSaleProduct.createMany({
    data: pointOfSales.flatMap((pointOfSale) =>
      products.map((product) => ({
        pointOfSaleId: pointOfSale.id,
        productId: product.id,
        createdBy: user.id,
      }))
    ),
  });

  const pointOfSaleProducts = await prisma.pointOfSaleProduct.findMany({
    include: {
      pointOfSale: true,
      product: true,
    },
    orderBy: [
      {
        pointOfSaleId: 'asc',
      },
      {
        productId: 'asc',
      },
    ],
  });

  return pointOfSaleProducts;
}
