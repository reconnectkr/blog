import fastifyJwt from '@fastify/jwt';
import { Coupon, PrismaClient, User } from '@prisma/client';
import Fastify, { FastifyInstance } from 'fastify';
import { app, SECRET } from '../../../app';
import { createTestFixtures, deleteTestFixtures } from './test-fixtures';

describe('PATCH /coupon/:couponId', () => {
  let server: FastifyInstance;
  let prisma: PrismaClient;
  let fixtures: Coupon[];
  let users: User[];
  let jwtToken: string;

  beforeAll(async () => {
    server = Fastify();
    server.register(app);
    server.register(fastifyJwt, {
      secret: SECRET,
    });
    await server.ready();

    prisma = new PrismaClient();
    await deleteTestFixtures(prisma);
  });

  beforeEach(async () => {
    fixtures = await createTestFixtures(prisma);
    users = await prisma.user.findMany();
    // Generate a JWT token for testing
    jwtToken = server.jwt.sign({
      userId: users[0].id,
      username: users[0].username,
      role: 'admin',
    });
  });

  afterEach(async () => {
    await deleteTestFixtures(prisma);
  });

  afterAll(async () => {
    await server.close();
    await prisma.$disconnect();
  });

  it('should update a coupon when given a valid ID', async () => {
    const couponId = fixtures[0].id;
    const updateData = {
      retrievedAt: new Date(),
      retrievedBy: users[2].id,
    };

    const response = await server.inject({
      method: 'PATCH',
      url: `/api/v1/coupon/${couponId}`,
      payload: updateData,
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    expect(response.statusCode).toBe(200);
    const updatedCoupon = response.json();
    expect(updatedCoupon.id).toBe(couponId);
    expect(new Date(updatedCoupon.retrievedAt)).toEqual(updateData.retrievedAt);
    expect(updatedCoupon.retrievedBy).toBe(updateData.retrievedBy);
  });

  it('should return 404 when given a non-existent ID', async () => {
    const nonExistentId = 9999;
    const updateData = {
      retrievedAt: new Date(),
      retrievedBy: 'TestUser',
    };

    const response = await server.inject({
      method: 'PATCH',
      url: `/api/v1/coupon/${nonExistentId}`,
      payload: updateData,
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    expect(response.statusCode).toBe(404);
    const errorResponse = response.json();
    expect(errorResponse.message).toBe('Coupon not found');
  });

  it('should return 400 when given invalid update data', async () => {
    const couponId = fixtures[0].id;
    const invalidUpdateData = {
      retrievedAt: 'not-a-date',
      retrievedBy: 123, // should be a string
    };

    const response = await server.inject({
      method: 'PATCH',
      url: `/api/v1/coupon/${couponId}`,
      payload: invalidUpdateData,
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    expect(response.statusCode).toBe(400);
    const errorResponse = response.json();
    expect(errorResponse.message).toMatchInlineSnapshot(`
      {
        "details": [
          {
            "code": "invalid_date",
            "message": "Invalid date",
            "path": [
              "retrievedAt",
            ],
          },
          {
            "code": "invalid_type",
            "expected": "string",
            "message": "Expected string, received number",
            "path": [
              "retrievedBy",
            ],
            "received": "number",
          },
        ],
        "name": "ZodValidationError",
      }
    `);
  });

  it('should only update specified fields', async () => {
    const couponId = fixtures[2].id;
    const updateData = {
      retrievedBy: users[1].id,
    };

    const response = await server.inject({
      method: 'PATCH',
      url: `/api/v1/coupon/${couponId}`,
      payload: updateData,
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    expect(response.statusCode).toBe(200);
    const updatedCoupon = response.json();
    expect(updatedCoupon.id).toBe(couponId);
    expect(updatedCoupon.retrievedBy).toBe(updateData.retrievedBy);
    expect(updatedCoupon.retrievedAt).toBe(
      fixtures[2].retrievedAt?.toISOString() || null
    );
  });

  it('should allow setting fields to null', async () => {
    const couponId = fixtures[3].id;
    const updateData = {
      retrievedAt: null,
      retrievedBy: null,
    };

    const response = await server.inject({
      method: 'PATCH',
      url: `/api/v1/coupon/${couponId}`,
      payload: updateData,
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    expect(response.statusCode).toBe(200);
    const updatedCoupon = response.json();
    expect(updatedCoupon.id).toBe(couponId);
    expect(updatedCoupon.retrievedAt).toBeNull();
    expect(updatedCoupon.retrievedBy).toBeNull();
  });
});
