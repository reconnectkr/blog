import fastifyJwt from '@fastify/jwt';
import { Category, Post, User } from '@prisma/client';
import {
  prisma,
  seedCategory,
  seedPost,
  seedUser,
} from '@reconnect/prisma-repository-common';
import Fastify, { FastifyInstance } from 'fastify';
import { app, SECRET } from '../../../app';

describe('POST /api/v1/post', () => {
  let server: FastifyInstance;
  let categories: Category[];
  let posts: Post[];
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
    posts = await seedPost(prisma);
    // Generate a JWT token for testing
    jwtToken = server.jwt.sign({
      userId: users[0].id,
      username: users[0].username,
      role: 'admin',
    });
  }

  async function deleteTestFixtures() {
    await prisma.categoriesOnPosts.deleteMany();
    await prisma.post.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();
  }

  it('should create a new post', async () => {
    const category = await prisma.category.findFirstOrThrow();

    const newItem = {
      title: 'Test Title',
      content: 'Test Content',
      categories: [category.name],
    };

    const response = await server.inject({
      method: 'POST',
      url: '/api/v1/post',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      payload: newItem,
    });

    expect(response.statusCode).toBe(201);
    const responseBody = JSON.parse(response.body);
    expect(responseBody).toMatchObject({
      ...newItem,
      categories: [
        {
          id: category.id,
          name: category.name,
        },
      ],
    });
    expect(responseBody).toHaveProperty('id');
  });

  it('should return 400 for invalid input', async () => {
    const invalidItem = {
      // Missing required fields
    };

    const response = await server.inject({
      method: 'POST',
      url: '/api/v1/post',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      payload: invalidItem,
    });

    expect(response.statusCode).toBe(400);
  });

  it('should return 401 for unauthorized access', async () => {
    const category = await prisma.category.findFirstOrThrow();

    const newItem = {
      title: 'Test Title',
      content: 'Test Content',
      categories: [category.name],
    };

    const response = await server.inject({
      method: 'POST',
      url: '/api/v1/post',
      payload: newItem,
    });

    expect(response.statusCode).toBe(401);
  });
});
