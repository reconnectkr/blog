import fastifyJwt from '@fastify/jwt';
import { User } from '@prisma/client';
import { prisma, seedUser } from '@reconnect/prisma-repository-common';
import Fastify, { FastifyInstance } from 'fastify';
import { app, SECRET } from '../../../app';

describe('PATCH /user/:userId', () => {
  let server: FastifyInstance;
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

  async function createTestFixtures() {
    users = await seedUser(prisma);
  }

  async function deleteTestFixtures() {
    await prisma.user.deleteMany();
  }

  afterAll(async () => {
    await server.close();
    await prisma.$disconnect();
  });

  it('should update user successfully', async () => {
    const userToUpdate = users[0];
    const updateData = {
      email: 'newemail@example.com',
      name: 'Updated Name',
      mobile: '1234567890',
      active: false,
    };

    const response = await server.inject({
      method: 'PATCH',
      url: `/api/v1/user/${userToUpdate.id}`,
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      payload: updateData,
    });

    expect(response.statusCode).toBe(200);
    const updatedUser = JSON.parse(response.payload);
    expect(updatedUser).toMatchObject({
      id: userToUpdate.id,
      email: updateData.email,
      username: userToUpdate.username,
      name: updateData.name,
      mobile: updateData.mobile,
      active: updateData.active,
    });
  });

  it('should return 400 for invalid input', async () => {
    const userToUpdate = users[0];
    const invalidData = {
      email: 'invalid-email',
      unknownField: 'some value',
    };

    const response = await server.inject({
      method: 'PATCH',
      url: `/api/v1/user/${userToUpdate.id}`,
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      payload: invalidData,
    });

    expect(response.statusCode).toBe(400);
  });

  it('should return 404 for non-existent user', async () => {
    const nonExistentUserId = 'non-existent-id';
    const updateData = { name: 'New Name' };

    const response = await server.inject({
      method: 'PATCH',
      url: `/api/v1/user/${nonExistentUserId}`,
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      payload: updateData,
    });

    expect(response.statusCode).toBe(404);
  });
});
