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

describe('DELETE /api/v1/post/:id', () => {
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
  it('should delete an post successfully', async () => {
    const post = posts[0];
    const response = await server.inject({
      method: 'DELETE',
      url: `/api/v1/post/${post.id}`,
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    expect(response.statusCode).toBe(204);
    expect(response.body).toBe('');

    // Verify the item has been deleted
    const deletedItem = await prisma.post.findUnique({
      where: { id: post.id },
    });
    expect(deletedItem).toBeNull();
  });

  it('should return 404 if post does not exist', async () => {
    const nonExistentId = 999999;
    const response = await server.inject({
      method: 'DELETE',
      url: `/api/v1/post/${nonExistentId}`,
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    expect(response.statusCode).toBe(404);
  });

  it('should return 401 if not authenticated', async () => {
    const post = posts[0];
    const response = await server.inject({
      method: 'DELETE',
      url: `/api/v1/post/${post.id}`,
    });

    expect(response.statusCode).toBe(401);
  });

  it('should return 400 if id is not a positive integer', async () => {
    const response = await server.inject({
      method: 'DELETE',
      url: '/api/v1/post/invalid',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    expect(response.statusCode).toBe(400);
  });
});
