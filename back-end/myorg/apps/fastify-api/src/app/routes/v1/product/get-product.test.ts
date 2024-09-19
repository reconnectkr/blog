import fastifyJwt from '@fastify/jwt';
import { Product, User } from '@prisma/client';
import {
  prisma,
  seedProduct,
  seedUser,
} from '@reconnect/prisma-repository-common';
import Fastify, { FastifyInstance } from 'fastify';
import { app, SECRET } from '../../../app';

describe('GET /api/v1/product/:productId', () => {
  let server: FastifyInstance;
  let products: Product[];
  let users: User[];
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

    // Generate a JWT token for testing
    jwtToken = server.jwt.sign({
      userId: users[0].id,
      username: users[0].username,
      role: 'admin',
    });
  });

  afterAll(async () => {
    await deleteTestFixtures();
    await server.close();
  });

  async function createTestFixtures() {
    users = await seedUser(prisma);
    products = await seedProduct(prisma);
  }

  async function deleteTestFixtures() {
    await prisma.productInventoryItem.deleteMany();
    await prisma.product.deleteMany();
    await prisma.inventoryItem.deleteMany();
    await prisma.inventoryItemCategory.deleteMany();
    await prisma.inventoryItemCategoryType.deleteMany();
    await prisma.unit.deleteMany();
    await prisma.unitType.deleteMany();
    await prisma.user.deleteMany();
  }
  it('should return a product when given a valid ID', async () => {
    const response = await server.inject({
      method: 'GET',
      url: `/api/v1/product/${products[0].id}`,
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body).toMatchObject({
      id: products[0].id,
      name: products[0].name,
    });
  });

  it('should return 404 when given an invalid ID', async () => {
    const invalidId = 9999;
    const response = await server.inject({
      method: 'GET',
      url: `/api/v1/product/${invalidId}`,
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    expect(response.statusCode).toBe(404);
  });

  it('should return 401 when no JWT token is provided', async () => {
    const response = await server.inject({
      method: 'GET',
      url: `/api/v1/product/${products[0].id}`,
    });

    expect(response.statusCode).toBe(401);
  });

  it('should return 400 when given a non-numeric ID', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/api/v1/product/invalid',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    expect(response.statusCode).toBe(400);
  });
});
