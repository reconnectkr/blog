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

describe('PATCH /api/v1/post/:postId', () => {
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

  it('should update an post successfully', async () => {
    const post = posts[0];
    const category1 = categories[1];
    const category2 = categories[2];
    const updateData = {
      title: 'Updated Item Title',
      content: 'New Content',
      categories: [category1.name, category2.name],
    };

    const response = await server.inject({
      method: 'PATCH',
      url: `/api/v1/post/${post.id}`,
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      payload: updateData,
    });

    expect(response.statusCode).toBe(200);
    const updatedItem = JSON.parse(response.payload);
    expect(updatedItem).toMatchObject({
      id: post.id,
      title: updateData.title,
      content: updateData.content,
      categories: [
        {
          id: category1.id,
          name: category1.name,
        },
        {
          id: category2.id,
          name: category2.name,
        },
      ],
    });
    expect(updatedItem.updatedAt).toBeTruthy();
  });

  it('should return 400 for invalid input', async () => {
    const invalidData = {
      inventoryUnitId: 'not a number',
    };

    const response = await server.inject({
      method: 'PATCH',
      url: `/api/v1/post/${posts[0].id}`,
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      payload: invalidData,
    });

    expect(response.statusCode).toBe(400);
  });

  it('should return 404 for non-existent post', async () => {
    const nonExistentId = 99999;
    const updateData = { title: 'Updated Item Title', content: 'New Content' };

    const response = await server.inject({
      method: 'PATCH',
      url: `/api/v1/post/${nonExistentId}`,
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      payload: updateData,
    });

    expect(response.statusCode).toBe(404);
  });

  it('should return 401 for unauthorized access', async () => {
    const updateData = { name: 'Test Update' };

    const response = await server.inject({
      method: 'PATCH',
      url: `/api/v1/post/${posts[0].id}`,
      payload: updateData,
    });

    expect(response.statusCode).toBe(401);
  });
});
