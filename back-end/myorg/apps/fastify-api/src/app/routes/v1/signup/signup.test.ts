import fastifyJwt from '@fastify/jwt';
import { prisma } from '@reconnect/prisma-repository-common';
import Fastify, { FastifyInstance } from 'fastify';
import { app, SECRET } from '../../../app';

describe('POST /signup', () => {
  let server: FastifyInstance;
  const email = 'newuser@example.com';
  const username = 'newuser';
  const name = 'New User';
  const password = 'password123';

  beforeAll(async () => {
    server = Fastify();
    server.register(app);
    server.register(fastifyJwt, {
      secret: SECRET,
    });
    await server.ready();

    await deleteTestFixtures();
  });

  async function deleteTestFixtures() {
    await prisma.user.deleteMany();
  }

  afterAll(async () => {
    await deleteTestFixtures();
    await server.close();
  });

  it('should create a new user and return user information', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/api/v1/signup',
      payload: {
        email,
        username,
        name,
        password,
      },
    });

    expect(response.statusCode).toBe(201);
    const body = JSON.parse(response.body);
    // Assert the user object matches SignUpResponse
    expect(body).toEqual({
      email,
      username,
      name,
    });

    // Check if the user was created in the database
    const createdUser = await prisma.user.findUnique({
      where: { email },
      include: {
        profile: true,
      },
    });
    expect(createdUser).not.toBeNull();
    expect(createdUser?.username).toBe(username);
    expect(createdUser?.email).toBe(email);
    expect(createdUser?.profile?.name).toBe(name);
  });

  it('should return 400 for invalid email format', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/api/v1/signup',
      payload: {
        email: 'invalidemail',
        username: 'testuser',
        password: 'password123',
      },
    });

    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body).message).toMatchInlineSnapshot(`
      {
        "details": [
          {
            "code": "invalid_string",
            "message": "Invalid email",
            "path": [
              "email",
            ],
            "validation": "email",
          },
          {
            "code": "invalid_type",
            "expected": "string",
            "message": "Required",
            "path": [
              "name",
            ],
            "received": "undefined",
          },
        ],
        "name": "ZodValidationError",
      }
    `);
  });

  it('should return 409 for existing email', async () => {
    // First, create a user
    await server.inject({
      method: 'POST',
      url: '/api/v1/signup',
      payload: {
        email: 'existing@example.com',
        username: 'existinguser',
        name: 'User 1',
        password: 'password123',
      },
    });

    // Try to create another user with the same email
    const response = await server.inject({
      method: 'POST',
      url: '/api/v1/signup',
      payload: {
        email: 'existing@example.com',
        username: 'newuser',
        name: 'User 2',
        password: 'password123',
      },
    });

    expect(response.statusCode).toBe(409);
    expect(JSON.parse(response.body)).toMatchInlineSnapshot(`
      {
        "message": "Email or username already exists",
      }
    `);
  });

  it('should return 409 for existing username', async () => {
    // First, create a user
    await server.inject({
      method: 'POST',
      url: '/api/v1/signup',
      payload: {
        email: 'user1@example.com',
        name: 'User 1',
        username: 'existingusername',
        password: 'password123',
      },
    });

    // Try to create another user with the same username
    const response = await server.inject({
      method: 'POST',
      url: '/api/v1/signup',
      payload: {
        email: 'user2@example.com',
        name: 'User 2',
        username: 'existingusername',
        password: 'password123',
      },
    });

    expect(response.statusCode).toBe(409);
    expect(JSON.parse(response.body)).toMatchInlineSnapshot(`
      {
        "message": "Email or username already exists",
      }
    `);
  });
});
