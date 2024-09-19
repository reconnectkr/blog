import fastifyJwt from '@fastify/jwt';
import { PointOfSale, PointOfSaleProduct, Product, User } from '@prisma/client';
import {
  prisma,
  seedPointOfSale,
  seedPointOfSaleProduct,
  seedProduct,
  seedUser,
} from '@reconnect/prisma-repository-common';
import Fastify, { FastifyInstance } from 'fastify';
import { app, SECRET } from '../../../../../app';

describe('DELETE /api/v1/product/:productId/inventory-item/:productId', () => {
  let server: FastifyInstance;
  let products: Product[];
  let product: Product;
  let pointOfSaleProducts: PointOfSaleProduct[];
  let pointOfSaleProduct: PointOfSaleProduct;
  let pointOfSales: PointOfSale[];
  let pointOfSale: PointOfSale;
  let users: User[];
  let user: User;
  let jwtToken: string;

  beforeAll(async () => {
    server = Fastify();
    server.register(app);
    server.register(fastifyJwt, {
      secret: SECRET,
    });

    await server.ready();

    await deleteTestFixtures();
    await createTestFixtures();
  });

  afterAll(async () => {
    await deleteTestFixtures();
    await server.close();
  });

  async function createTestFixtures() {
    users = await seedUser(prisma);
    user = users[0];
    products = await seedProduct(prisma);
    product = products[0];
    pointOfSales = await seedPointOfSale(prisma);
    pointOfSale = pointOfSales[0];
    pointOfSaleProducts = await seedPointOfSaleProduct(prisma);
    pointOfSaleProducts = await prisma.pointOfSaleProduct.findMany({
      orderBy: [
        {
          pointOfSaleId: 'asc',
        },
        {
          productId: 'asc',
        },
      ],
    });
    pointOfSaleProduct = pointOfSaleProducts[0];

    // Generate a JWT token for testing
    jwtToken = server.jwt.sign({
      userId: user.id,
      username: user.username,
      role: 'admin',
    });
  }

  async function deleteTestFixtures() {
    await prisma.pointOfSaleProduct.deleteMany();
    await prisma.pointOfSale.deleteMany();
    await prisma.productInventoryItem.deleteMany();
    await prisma.product.deleteMany();
    await prisma.inventoryItem.deleteMany();
    await prisma.inventoryItemCategory.deleteMany();
    await prisma.inventoryItemCategoryType.deleteMany();
    await prisma.unit.deleteMany();
    await prisma.unitType.deleteMany();
    await prisma.user.deleteMany();
    await prisma.department.deleteMany();
  }
  it('should delete an inventory item successfully', async () => {
    const response = await server.inject({
      method: 'DELETE',
      url: `/api/v1/point-of-sale/${pointOfSale.id}/product/${pointOfSaleProduct.productId}`,
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    expect(response.statusCode).toBe(204);
    expect(response.body).toBe('');

    // Verify the item has been deleted
    const deletedItem = await prisma.pointOfSaleProduct.findUnique({
      where: {
        pointOfSaleId_productId: {
          pointOfSaleId: pointOfSale.id,
          productId: product.id,
        },
      },
    });
    expect(deletedItem).toBeNull();
  });

  it('should return 404 if inventory item does not exist', async () => {
    const nonExistentId = 999999;
    const response = await server.inject({
      method: 'DELETE',
      url: `/api/v1/point-of-sale/${pointOfSale.id}/product/${nonExistentId}`,
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    expect(response.statusCode).toBe(404);
  });

  it('should return 401 if not authenticated', async () => {
    const response = await server.inject({
      method: 'DELETE',
      url: `/api/v1/point-of-sale/${pointOfSale.id}/product/${pointOfSaleProduct.productId}`,
    });

    expect(response.statusCode).toBe(401);
  });

  it('should return 400 if id is not a positive integer', async () => {
    const response = await server.inject({
      method: 'DELETE',
      url: `/api/v1/point-of-sale/${pointOfSale.id}/product/invalidInventoryItemId`,
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    expect(response.statusCode).toBe(400);
  });
});
