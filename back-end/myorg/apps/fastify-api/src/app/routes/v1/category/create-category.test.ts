import fastifyJwt from '@fastify/jwt';
import { Category, User } from '@prisma/client';
import {
  prisma,
  seedCategory,
  seedUser,
} from '@reconnect/prisma-repository-common';
import Fastify, { FastifyInstance } from 'fastify';
import { app, SECRET } from '../../../app';

describe('POST /api/v1/category', () => {
  let server: FastifyInstance;
  let categories: Category[];
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
    categories = await seedCategory(prisma);
    // Generate a JWT token for testing
    jwtToken = server.jwt.sign({
      userId: user.id,
      username: user.username,
      role: 'admin',
    });
  }

  async function deleteTestFixtures() {
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();
  }

  it('should create a new category', async () => {
    const newItem = {
      name: '신규 카테고리',
    };

    const response = await server.inject({
      method: 'POST',
      url: '/api/v1/category',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      payload: newItem,
    });

    expect(response.statusCode).toBe(201);
    const responseBody = JSON.parse(response.body);
    expect(responseBody).toMatchObject(newItem);
    expect(responseBody).toHaveProperty('id');
  });

  it('should return 400 for invalid input', async () => {
    const invalidItem = {
      // Missing required fields
    };

    const response = await server.inject({
      method: 'POST',
      url: '/api/v1/category',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      payload: invalidItem,
    });

    expect(response.statusCode).toBe(400);
  });

  it('should return 401 for unauthorized access', async () => {
    const newItem = {
      name: 'Unauthorized Item',
    };

    const response = await server.inject({
      method: 'POST',
      url: '/api/v1/category',
      payload: newItem,
    });

    expect(response.statusCode).toBe(401);
  });
});
