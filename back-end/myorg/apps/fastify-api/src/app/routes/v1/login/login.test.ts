import fastifyJwt from '@fastify/jwt';
import { User } from '@prisma/client';
import { prisma } from '@reconnect/prisma-repository-common';
import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import Fastify, { FastifyInstance } from 'fastify';
import { app, SECRET } from '../../../app';

describe('POST /login', () => {
  let server: FastifyInstance;
  const email = 'testuser@example.com';
  const username = 'testuser';
  const password = 'password123';
  let user: User;

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

  async function createTestFixtures() {
    // 테스트 사용자 생성
    const hashedPassword = await bcrypt.hash(password, 10);
    user = await prisma.user.create({
      data: {
        id: randomUUID(),
        email,
        username,
        password: hashedPassword,
      },
    });
  }

  async function deleteTestFixtures() {
    await prisma.user.deleteMany();
  }

  afterAll(async () => {
    await deleteTestFixtures();
    await server.close();
  });

  it('should return access and refresh tokens for valid credentials, email/password', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/api/v1/login',
      payload: {
        email,
        password,
      },
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body).toHaveProperty('accessToken');
    expect(body).toHaveProperty('refreshToken');
    server.jwt.verify(
      body.accessToken,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (err: any, decoded: any) => {
        expect(err).toBeNull();
        expect(decoded).toHaveProperty('userId');
        expect(decoded).toHaveProperty('role');
        expect(decoded.userId).toBe(user.id);
        expect(decoded.username).toBe(user.username);
        expect(decoded.exp - decoded.iat).toBe(15 * 60);
      }
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    server.jwt.verify(body.refreshToken, (err: any, decoded: any) => {
      expect(err).toBeNull();
      expect(decoded).toHaveProperty('userId');
      expect(decoded).toHaveProperty('role');
      expect(decoded.userId).toBe(user.id);
      expect(decoded.username).toBe(user.username);
      expect(decoded.exp - decoded.iat).toBe(7 * 24 * 60 * 60); // 7 days
    });
  });

  it('should return access and refresh tokens for valid credentials, username/password', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/api/v1/login',
      payload: {
        username,
        password,
      },
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body).toHaveProperty('accessToken');
    expect(body).toHaveProperty('refreshToken');
    server.jwt.verify(
      body.accessToken,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (err: any, decoded: any) => {
        expect(err).toBeNull();
        expect(decoded).toHaveProperty('userId');
        expect(decoded).toHaveProperty('role');
        expect(decoded.userId).toBe(user.id);
        expect(decoded.username).toBe(user.username);
        expect(decoded.exp - decoded.iat).toBe(15 * 60);
      }
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    server.jwt.verify(body.refreshToken, (err: any, decoded: any) => {
      expect(err).toBeNull();
      expect(decoded).toHaveProperty('userId');
      expect(decoded).toHaveProperty('role');
      expect(decoded.userId).toBe(user.id);
      expect(decoded.username).toBe(user.username);
      expect(decoded.exp - decoded.iat).toBe(7 * 24 * 60 * 60); // 7 days
    });
  });

  it('should return 401 for non-existent email', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/api/v1/login',
      payload: {
        email: 'nonexistent@example.com',
        password,
      },
    });

    expect(response.statusCode).toBe(401);
    expect(JSON.parse(response.body)).toEqual({
      message: 'Invalid email/username or password',
    });
  });

  it('should return 401 for incorrect password', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/api/v1/login',
      payload: {
        email,
        password: 'wrongpassword',
      },
    });

    expect(response.statusCode).toBe(401);
    expect(JSON.parse(response.body)).toEqual({
      message: 'Invalid email or password',
    });
  });

  it('should return 400 for invalid email format', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/api/v1/login',
      payload: {
        email: 'invalidemail',
        password: 'password123',
      },
    });

    expect(response.statusCode).toBe(400);
    // Zod validation error message
    expect(JSON.parse(response.body)).toHaveProperty('message');
  });
});
