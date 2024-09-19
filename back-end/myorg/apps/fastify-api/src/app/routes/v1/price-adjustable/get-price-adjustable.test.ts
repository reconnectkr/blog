import fastifyJwt from '@fastify/jwt';
import { PriceAdjustable, User } from '@prisma/client';
import {
  prisma,
  seedPriceAdjustable,
  seedUser,
} from '@reconnect/prisma-repository-common';
import Fastify, { FastifyInstance } from 'fastify';
import { app, SECRET } from '../../../app';

describe('GET /api/v1/price-adjustable/:priceAdjustableId', () => {
  let server: FastifyInstance;
  let priceAdjustables: PriceAdjustable[];
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
    priceAdjustables = await seedPriceAdjustable(prisma);
  }

  async function deleteTestFixtures() {
    await prisma.priceAdjustable.deleteMany();
    await prisma.user.deleteMany();
  }
  it('should return a priceAdjustable when given a valid ID', async () => {
    const response = await server.inject({
      method: 'GET',
      url: `/api/v1/price-adjustable/${priceAdjustables[0].id}`,
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body).toMatchObject({
      id: priceAdjustables[0].id,
      name: priceAdjustables[0].name,
    });
  });

  it('should return 404 when given an invalid ID', async () => {
    const invalidId = 9999;
    const response = await server.inject({
      method: 'GET',
      url: `/api/v1/price-adjustable/${invalidId}`,
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    expect(response.statusCode).toBe(404);
  });

  it('should return 401 when no JWT token is provided', async () => {
    const response = await server.inject({
      method: 'GET',
      url: `/api/v1/price-adjustable/${priceAdjustables[0].id}`,
    });

    expect(response.statusCode).toBe(401);
  });

  it('should return 400 when given a non-numeric ID', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/api/v1/price-adjustable/invalid',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    expect(response.statusCode).toBe(400);
  });
});
