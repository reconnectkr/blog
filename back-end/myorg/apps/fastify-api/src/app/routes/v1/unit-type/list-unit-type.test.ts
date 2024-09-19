import fastifyJwt from '@fastify/jwt';
import { UnitType, User } from '@prisma/client';
import {
  prisma,
  seedUnitType,
  seedUser,
} from '@reconnect/prisma-repository-common';
import Fastify, { FastifyInstance } from 'fastify';
import { app, SECRET } from '../../../app';

describe('GET /api/v1/unit-type', () => {
  let server: FastifyInstance;
  let unitTypes: UnitType[];
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
    await seedUnitType(prisma);
    unitTypes = await prisma.unitType.findMany({ orderBy: { id: 'asc' } });
  }

  async function deleteTestFixtures() {
    await prisma.unitType.deleteMany();
    await prisma.user.deleteMany();
  }

  it('should return a list of unit types', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/api/v1/unit-type',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body).toHaveProperty('items');
    expect(Array.isArray(body.items)).toBe(true);
    expect(body.items.length).toBe(unitTypes.length);
  });

  it('should filter unit types by name', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/api/v1/unit-type?filter[name]=Test',
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

  it('should order unit types by name descending', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/api/v1/unit-type?orderBy[name]=desc',
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
      url: `/api/v1/unit-type?page=1&pageSize=${pageSize}`,
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
      url: '/api/v1/unit-type',
    });

    expect(response.statusCode).toBe(401);
  });

  it('should return 400 for invalid query parameters', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/api/v1/unit-type?invalidQueryParam=1000',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    expect(response.statusCode).toBe(400);
  });
});
