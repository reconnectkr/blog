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

describe('POST /api/v1/point-of-sale/:pointOfSaleId/product', () => {
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

  it('should create a new pointOfSaleProduct', async () => {
    await prisma.pointOfSaleProduct.delete({
      where: {
        pointOfSaleId_productId: {
          pointOfSaleId: pointOfSale.id,
          productId: product.id,
        },
      },
    });

    const newPointOfSaleProduct = {
      productId: product.id,
    };

    const response = await server.inject({
      method: 'POST',
      url: `/api/v1/point-of-sale/${pointOfSale.id}/product`,
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      payload: newPointOfSaleProduct,
    });

    expect(response.statusCode).toBe(201);
    const createdPointOfSaleProduct = JSON.parse(response.payload);
    expect(createdPointOfSaleProduct).toMatchObject({
      product: {
        id: product.id,
        name: product.name,
        price: product.price.toString(),
      },
    });

    // Verify the pointOfSaleProduct was actually created in the database
    const dbPointOfSaleProduct =
      await prisma.pointOfSaleProduct.findUniqueOrThrow({
        where: {
          pointOfSaleId_productId: {
            pointOfSaleId: pointOfSale.id,
            productId: product.id,
          },
        },
      });
    expect(dbPointOfSaleProduct.pointOfSaleId).toEqual(pointOfSale.id);
    expect(dbPointOfSaleProduct.productId).toEqual(product.id);
    expect(dbPointOfSaleProduct.createdAt).toEqual(
      new Date(createdPointOfSaleProduct.createdAt)
    );
    expect(dbPointOfSaleProduct.createdBy).toBe(user.id);
  });

  it('should return 400 for invalid input', async () => {
    const invalidPointOfSaleProduct = {
      name: '', // Empty name should be invalid
      price: 'not a number',
      description: null,
    };

    const response = await server.inject({
      method: 'POST',
      url: `/api/v1/point-of-sale/${pointOfSale.id}/product`,
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      payload: invalidPointOfSaleProduct,
    });

    expect(response.statusCode).toBe(400);
    const error = JSON.parse(response.payload);
    expect(error).toHaveProperty('message');
  });

  it('should return 401 if not authenticated', async () => {
    const newPointOfSaleProduct = {
      name: 'Test PointOfSaleProduct',
      price: '19.99',
      description: 'This is a test pointOfSaleProduct',
    };

    const response = await server.inject({
      method: 'POST',
      url: `/api/v1/point-of-sale/${pointOfSale.id}/product`,
      payload: newPointOfSaleProduct,
    });

    expect(response.statusCode).toBe(401);
  });
});
