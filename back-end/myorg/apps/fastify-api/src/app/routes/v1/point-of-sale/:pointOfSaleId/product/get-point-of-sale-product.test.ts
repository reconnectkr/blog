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

describe('GET /api/v1/point-of-sale/:pointOfSaleId/product/:productId', () => {
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
  it('should return a pointOfSaleProduct when given a valid ID', async () => {
    const response = await server.inject({
      method: 'GET',
      url: `/api/v1/point-of-sale/${pointOfSale.id}/product/${pointOfSaleProduct.productId}`,
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    const product = await getProduct(pointOfSaleProduct.productId);

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body).toMatchObject({
      product: {
        id: product.id,
        name: product.name,
        price: product.price.toString(),
      },
      createdAt: pointOfSaleProduct.createdAt.toISOString(),
      createdBy: pointOfSaleProduct.createdBy,
    });
  });

  it('should return 404 when given an invalid ID', async () => {
    const invalidId = 9999;
    const response = await server.inject({
      method: 'GET',
      url: `/api/v1/point-of-sale/${pointOfSale.id}/product/${invalidId}`,
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    expect(response.statusCode).toBe(404);
  });

  it('should return 401 when no JWT token is provided', async () => {
    const response = await server.inject({
      method: 'GET',
      url: `/api/v1/point-of-sale/${pointOfSale.id}/product/${pointOfSaleProduct.productId}`,
    });

    expect(response.statusCode).toBe(401);
  });

  it('should return 400 when given a non-numeric ID', async () => {
    const response = await server.inject({
      method: 'GET',
      url: `/api/v1/point-of-sale/${pointOfSale.id}/product/invalidId`,
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    expect(response.statusCode).toBe(400);
  });
});

async function getProduct(id: number) {
  return await prisma.product.findFirstOrThrow({
    where: {
      id,
    },
  });
}
