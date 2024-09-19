import fastifyJwt from '@fastify/jwt';
import { Department, Profile, User } from '@prisma/client';
import {
  prisma,
  seedDepartment,
  seedUser,
} from '@reconnect/prisma-repository-common';
import Fastify, { FastifyInstance } from 'fastify';
import { app, SECRET } from '../../../app';
import { CreateUserRequest } from './dto/create-user.dto';

describe('POST /api/v1/user', () => {
  let server: FastifyInstance;
  let jwtToken: string;
  let users: Array<User & { profile: Profile | null }>;
  let departments: Department[];

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

  afterEach(async () => {
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await server.close();
    await prisma.user.deleteMany();
  });

  async function createTestFixtures() {
    users = await seedUser(prisma);
    departments = await seedDepartment(prisma);
  }

  async function deleteTestFixtures() {
    await prisma.department.deleteMany();
    await prisma.user.deleteMany();
  }

  it('should create a new user', async () => {
    const newUser: CreateUserRequest = {
      email: 'test@example.com',
      username: 'testuser',
      password: 'password123',
      name: 'Test User',
      mobile: '1234567890',
      photo: 'https://example.com/photo.jpg',
      departmentId: 1,
    };

    const response = await server.inject({
      method: 'POST',
      url: '/api/v1/user',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      payload: newUser,
    });

    expect(response.statusCode).toBe(201);
    const createdUser = JSON.parse(response.payload);
    expect(createdUser).toMatchObject({
      email: newUser.email,
      username: newUser.username,
      name: newUser.name,
      mobile: newUser.mobile,
      photo: newUser.photo,
      departmentId: newUser.departmentId,
    });
    expect(createdUser.password).toBeUndefined();
  });

  it('should return 400 for invalid input', async () => {
    const invalidUser = {
      email: 'invalid-email',
      username: 'testuser',
      password: 'password123',
      name: 'Test User',
    };

    const response = await server.inject({
      method: 'POST',
      url: '/api/v1/user',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      payload: invalidUser,
    });

    expect(response.statusCode).toBe(400);
  });

  it('should return 401 for unauthorized access', async () => {
    const newUser: CreateUserRequest = {
      email: 'test@example.com',
      username: 'testuser',
      password: 'password123',
      name: 'Test User',
      mobile: '1234567890',
      photo: null,
      departmentId: departments[0].id,
    };

    const response = await server.inject({
      method: 'POST',
      url: '/api/v1/user',
      payload: newUser,
    });

    expect(response.statusCode).toBe(401);
  });
});
