import fastifyJwt from '@fastify/jwt';
import { PointOfSale, User } from '@prisma/client';
import {
  prisma,
  seedPointOfSale,
  seedUser,
} from '@reconnect/prisma-repository-common';
import Fastify, { FastifyInstance } from 'fastify';
import { app, SECRET } from '../../../app';

describe('GET /api/v1/point-of-sale', () => {
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
    users = await seedUser(prisma);
    pointOfSales = await seedPointOfSale(prisma);
  }

  async function deleteTestFixtures() {
    await prisma.pointOfSale.deleteMany();
    await prisma.user.deleteMany();
  }

  it('should return a list of pointOfSales', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/api/v1/point-of-sale',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body).toHaveProperty('items');
    expect(Array.isArray(body.items)).toBe(true);
    expect(body.items.length).toBe(pointOfSales.length);
  });

  it('should filter pointOfSales by name', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/api/v1/point-of-sale?filter[name]=Test',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(
      body.items.every((item: { name: string | string[] }) =>
        item.name.includes('Test')
      )
    ).toBe(true);
  });

  it('should order pointOfSales by name descending', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/api/v1/point-of-sale?orderBy[name]=desc',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    const names = body.items.map((item: { name: string }) => item.name);
    expect(names).toEqual([...names].sort().reverse());
  });

  it('should paginate results', async () => {
    const pageSize = 2;
    const response = await server.inject({
      method: 'GET',
      url: `/api/v1/point-of-sale?page=1&pageSize=${pageSize}`,
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.items.length).toBe(pageSize);
  });

  it('should return 401 if not authenticated', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/api/v1/point-of-sale',
    });

    expect(response.statusCode).toBe(401);
  });

  it('should return 400 for invalid query parameters', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/api/v1/point-of-sale?invalidQueryParam=1000',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    expect(response.statusCode).toBe(400);
  });
});
