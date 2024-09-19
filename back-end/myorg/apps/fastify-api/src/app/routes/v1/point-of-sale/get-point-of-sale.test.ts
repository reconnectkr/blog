import fastifyJwt from '@fastify/jwt';
import { PointOfSale, User } from '@prisma/client';
import {
  prisma,
  seedPointOfSale,
  seedUser,
} from '@reconnect/prisma-repository-common';
import Fastify, { FastifyInstance } from 'fastify';
import { app, SECRET } from '../../../app';

describe('GET /api/v1/point-of-sale/:pointOfSaleId', () => {
  let server: FastifyInstance;
  let pointOfSales: PointOfSale[];
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
    await seedUser(prisma);
    users = await prisma.user.findMany();
    pointOfSales = await seedPointOfSale(prisma);
  }

  async function deleteTestFixtures() {
    await prisma.pointOfSale.deleteMany();
    await prisma.department.deleteMany();
    await prisma.user.deleteMany();
  }
  it('should return a pointOfSale when given a valid ID', async () => {
    const response = await server.inject({
      method: 'GET',
      url: `/api/v1/point-of-sale/${pointOfSales[0].id}`,
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body).toMatchObject({
      id: pointOfSales[0].id,
      name: pointOfSales[0].name,
      description: pointOfSales[0].description,
    });
  });

  it('should return 404 when given an invalid ID', async () => {
    const invalidId = 9999;
    const response = await server.inject({
      method: 'GET',
      url: `/api/v1/point-of-sale/${invalidId}`,
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    expect(response.statusCode).toBe(404);
  });

  it('should return 401 when no JWT token is provided', async () => {
    const response = await server.inject({
      method: 'GET',
      url: `/api/v1/point-of-sale/${pointOfSales[0].id}`,
    });

    expect(response.statusCode).toBe(401);
  });

  it('should return 400 when given a non-numeric ID', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/api/v1/point-of-sale/invalid',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    expect(response.statusCode).toBe(400);
  });
});
