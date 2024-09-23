import fastifyJwt from '@fastify/jwt';
import { Category, User } from '@prisma/client';
import {
  prisma,
  seedCategory,
  seedUser,
} from '@reconnect/prisma-repository-common';
import Fastify, { FastifyInstance } from 'fastify';
import { app, SECRET } from '../../../app';

describe('DELETE /api/v1/category/:id', () => {
  let server: FastifyInstance;
  let categories: Category[];
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
  });

  afterAll(async () => {
    await deleteTestFixtures();
    await server.close();
  });

  async function createTestFixtures() {
    users = await seedUser(prisma);
    categories = await seedCategory(prisma);

    // Generate a JWT token for testing
    jwtToken = server.jwt.sign({
      userId: users[0].id,
      username: users[0].username,
      role: 'admin',
    });
  }

  async function deleteTestFixtures() {
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();
  }
  it('should delete an inventory item successfully', async () => {
    const category = categories[0];
    const response = await server.inject({
      method: 'DELETE',
      url: `/api/v1/category/${category.id}`,
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    expect(response.statusCode).toBe(204);
    expect(response.body).toBe('');

    // Verify the item has been deleted
    const deletedItem = await prisma.category.findUnique({
      where: { id: category.id },
    });
    expect(deletedItem).toBeNull();
  });

  it('should return 404 if inventory item does not exist', async () => {
    const nonExistentId = 999999;
    const response = await server.inject({
      method: 'DELETE',
      url: `/api/v1/category/${nonExistentId}`,
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    expect(response.statusCode).toBe(404);
  });

  it('should return 401 if not authenticated', async () => {
    const category = categories[0];
    const response = await server.inject({
      method: 'DELETE',
      url: `/api/v1/category/${category.id}`,
    });

    expect(response.statusCode).toBe(401);
  });

  it('should return 400 if id is not a positive integer', async () => {
    const response = await server.inject({
      method: 'DELETE',
      url: '/api/v1/category/invalid',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    expect(response.statusCode).toBe(400);
  });
});
