import fastifyJwt from '@fastify/jwt';
import { Post, User } from '@prisma/client';
import {
  prisma,
  seedPost,
  seedUser,
} from '@reconnect/prisma-repository-common';
import Fastify, { FastifyInstance } from 'fastify';
import { app, SECRET } from '../../../app';

describe('GET /api/v1/post/:slug', () => {
  let server: FastifyInstance;
  let posts: Post[];
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
    users = await seedUser(prisma);
    posts = await seedPost(prisma);
  }

  async function deleteTestFixtures() {
    await prisma.categoriesOnPosts.deleteMany();
    await prisma.post.deleteMany();
    await prisma.categoriesOnPosts.deleteMany();
    await prisma.unit.deleteMany();
    await prisma.unitType.deleteMany();
    await prisma.user.deleteMany();
  }
  it('should return a Post when given a valid ID', async () => {
    const post = await prisma.post.findFirstOrThrow({
      where: {
        id: posts[0].id,
      },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
    });
    const category = post.categories[0].category;

    const response = await server.inject({
      method: 'GET',
      url: `/api/v1/post/${post.slug}`,
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body).toMatchObject({
      id: post.id,
      slug: post.slug,
      title: post.title,
      content: post.content,
      authorId: post.authorId,
      categories: [{ id: category.id, name: category.name }],
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    });
  });

  it('should return 404 when given an invalid ID', async () => {
    const invalidSlug = 'invalid-slug';
    const response = await server.inject({
      method: 'GET',
      url: `/api/v1/post/${invalidSlug}`,
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    console.log(response.json());
    expect(response.statusCode).toBe(404);
  });

  it('should return 401 when no JWT token is provided', async () => {
    const response = await server.inject({
      method: 'GET',
      url: `/api/v1/post/${posts[0].slug}`,
    });

    expect(response.statusCode).toBe(401);
  });

  it('should return 404 when given a non-numeric ID', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/api/v1/post/invalid',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    expect(response.statusCode).toBe(404);
  });
});
