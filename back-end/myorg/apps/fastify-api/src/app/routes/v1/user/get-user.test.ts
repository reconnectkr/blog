import fastifyJwt from '@fastify/jwt';
import { Profile, User } from '@prisma/client';
import { prisma, seedUser } from '@reconnect/prisma-repository-common';
import Fastify, { FastifyInstance } from 'fastify';
import { app, SECRET } from '../../../app';

describe('GET /user/:userId', () => {
  let server: FastifyInstance;
  let users: Array<User & { profile: Profile | null }>;
  let jwtToken: string;

  beforeAll(async () => {
    server = Fastify();
    server.register(app);
    server.register(fastifyJwt, {
      secret: SECRET,
    });

    await server.ready();

    await deleteTestFixtures();
    users = await createTestFixtures();

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
    return await seedUser(prisma);
  }

  async function deleteTestFixtures() {
    await prisma.user.deleteMany();
  }

  it('should return a user when given a valid userId', async () => {
    const response = await server.inject({
      method: 'GET',
      url: `/api/v1/user/${users[0].id}`,
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    expect(response.statusCode).toBe(200);
    const user = JSON.parse(response.payload);
    expect(user).toMatchObject({
      id: users[0].id,
      username: users[0].username,
      name: users[0].profile?.name,
    });
  });

  it('should return 404 when given an invalid userId', async () => {
    const invalidUserId = 'invalid-user-id';
    const response = await server.inject({
      method: 'GET',
      url: `/api/v1/user/${invalidUserId}`,
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    expect(response.statusCode).toBe(404);
    expect(JSON.parse(response.payload)).toEqual({ message: 'User not found' });
  });

  it('should return 401 when no JWT token is provided', async () => {
    const response = await server.inject({
      method: 'GET',
      url: `/api/v1/user/${users[0].id}`,
    });

    expect(response.statusCode).toBe(401);
  });
});
