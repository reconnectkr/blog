import fastifyJwt from '@fastify/jwt';
import { Profile, User } from '@prisma/client';
import { prisma, seedUser } from '@reconnect/prisma-repository-common';
import Fastify, { FastifyInstance } from 'fastify';
import { app, SECRET } from '../../../app';

describe('GET /user', () => {
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
    await server.close();
  });

  async function createTestFixtures() {
    return await seedUser(prisma);
  }

  async function deleteTestFixtures() {
    await prisma.user.deleteMany();
  }
  it('should return a list of users', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/api/v1/user',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    body.items.forEach((item: any, index: number) => {
      expect(item).toEqual({
        id: users[index].id,
        username: users[index].username,
        name: users[index].profile?.name,
        mobile: users[index].profile?.mobile,
        photo: users[index].profile?.photo,
        departmentId: users[index].profile?.departmentId,
      });
    });
  });

  it('should filter users', async () => {
    const username = users[2].username;
    const response = await server.inject({
      method: 'GET',
      url: `/api/v1/user?filter[username]=${username}`,
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.items.length).toBe(1);
    expect(body.items[0].username).toBe(username);
  });

  it('should order users', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/api/v1/user?orderBy[username]=desc',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    const usernames = body.items.map((user: any) => user.username);
    expect(usernames).toEqual([...usernames].sort().reverse());
  });

  it('should paginate users', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/api/v1/user?page=1&pageSize=2',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.items.length).toBe(2);
  });

  it('should return 401 if not authenticated', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/api/v1/user',
    });

    expect(response.statusCode).toBe(401);
  });
});
