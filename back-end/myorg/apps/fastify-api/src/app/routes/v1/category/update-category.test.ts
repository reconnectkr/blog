import fastifyJwt from '@fastify/jwt';
import { Category, User } from '@prisma/client';
import {
  prisma,
  seedCategory,
  seedUser,
} from '@reconnect/prisma-repository-common';
import Fastify, { FastifyInstance } from 'fastify';
import { app, SECRET } from '../../../app';

describe('PATCH /api/v1/category/:categoryId', () => {
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

  it('should update an inventory item successfully', async () => {
    const category = categories[0];
    const updateData = {
      name: 'Updated Item Name',
    };

    const response = await server.inject({
      method: 'PATCH',
      url: `/api/v1/category/${category.id}`,
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      payload: updateData,
    });

    expect(response.statusCode).toBe(200);
    const updatedItem = JSON.parse(response.payload);
    expect(updatedItem).toMatchObject({
      id: category.id,
      name: updateData.name,
    });
    // expect(updatedItem.updatedAt).toBeTruthy();
    // expect(updatedItem.updatedBy).toBe(user.id);
  });

  it('should return 400 for invalid input', async () => {
    const category = categories[0];
    const invalidData = {
      inventoryUnitId: 'not a number',
    };

    const response = await server.inject({
      method: 'PATCH',
      url: `/api/v1/category/${category.id}`,
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      payload: invalidData,
    });

    expect(response.statusCode).toBe(400);
  });

  it('should return 404 for non-existent inventory item', async () => {
    const nonExistentId = 99999;
    const updateData = { name: 'Test Update' };

    const response = await server.inject({
      method: 'PATCH',
      url: `/api/v1/category/${nonExistentId}`,
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      payload: updateData,
    });

    expect(response.statusCode).toBe(404);
  });

  it('should return 401 for unauthorized access', async () => {
    const category = categories[0];

    const updateData = { name: 'Test Update' };

    const response = await server.inject({
      method: 'PATCH',
      url: `/api/v1/category/${category.id}`,
      payload: updateData,
    });

    expect(response.statusCode).toBe(401);
  });
});
