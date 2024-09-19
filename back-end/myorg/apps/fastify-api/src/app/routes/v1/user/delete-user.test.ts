import fastifyJwt from '@fastify/jwt';
import { PrismaClient, User } from '@prisma/client';
import { seedUser } from '@reconnect/prisma-repository-common';
import Fastify, { FastifyInstance } from 'fastify';
import { app, SECRET } from '../../../app';

describe('DELETE /api/v1/user/:userId', () => {
  let server: FastifyInstance;
  let prisma: PrismaClient;
  let jwtToken: string;
  let users: User[];
  beforeAll(async () => {
    server = Fastify();
    server.register(app);
    server.register(fastifyJwt, {
      secret: SECRET,
    });
    await server.ready();

    prisma = new PrismaClient();
    await deleteTestFixtures();
  });

  beforeEach(async () => {
    await createTestFixtures();
    users = await prisma.user.findMany();
    // Generate a JWT token for testing
    jwtToken = server.jwt.sign({
      userId: users[0].id,
      username: users[0].username,
      role: 'admin',
    });
  });

  afterEach(async () => {
    await deleteTestFixtures();
  });

  afterAll(async () => {
    await server.close();
    await prisma.$disconnect();
  });

  async function createTestFixtures() {
    return await seedUser(prisma);
  }

  async function deleteTestFixtures() {
    await prisma.user.deleteMany();
  }

  it('should delete a user when given a valid ID', async () => {
    const userId = users[0].id;

    const response = await server.inject({
      method: 'DELETE',
      url: `/api/v1/user/${userId}`,
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    expect(response.statusCode).toBe(204);
    expect(response.body).toBe('');

    // Verify the user was actually deleted from the database
    const deletedUser = await prisma.user.findUnique({
      where: { id: userId },
    });
    expect(deletedUser).toBeNull();
  });

  it('should return 404 when trying to delete a non-existent user', async () => {
    const nonExistentId = 9999;

    const response = await server.inject({
      method: 'DELETE',
      url: `/api/v1/user/${nonExistentId}`,
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    expect(response.statusCode).toBe(404);
    const errorResponse = JSON.parse(response.body);
    expect(errorResponse.message).toBe('User not found');
  });

  it('should return 400 when given an invalid ID format', async () => {
    const invalidId = 'not-a-number';

    const response = await server.inject({
      method: 'DELETE',
      url: `/api/v1/user/${invalidId}`,
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    expect(response.statusCode).toBe(404);
    const errorResponse = JSON.parse(response.body);
    expect(errorResponse.message).toMatchInlineSnapshot(`"User not found"`);
  });

  it('should not affect other users when deleting one', async () => {
    const userIdToDelete = users[0].id;
    const otherUserId = users[1].id;

    await server.inject({
      method: 'DELETE',
      url: `/api/v1/user/${userIdToDelete}`,
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    // Verify the other user still exists
    const otherUser = await prisma.user.findUnique({
      where: { id: otherUserId },
    });
    expect(otherUser).not.toBeNull();
    expect(otherUser?.id).toBe(otherUserId);
  });

  it('should handle deletion of already deleted user', async () => {
    const userId = users[0].id;

    // Delete the user for the first time
    await server.inject({
      method: 'DELETE',
      url: `/api/v1/user/${userId}`,
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    // Try to delete the same user again
    const response = await server.inject({
      method: 'DELETE',
      url: `/api/v1/user/${userId}`,
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    expect(response.statusCode).toBe(404);
    const errorResponse = JSON.parse(response.body);
    expect(errorResponse.message).toBe('User not found');
  });
});
