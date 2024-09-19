import fastifyJwt from '@fastify/jwt';
import { Coupon, User } from '@prisma/client';
import { prisma } from '@reconnect/prisma-repository-common';
import { Decimal } from 'decimal.js';
import Fastify, { FastifyInstance } from 'fastify';
import { app, SECRET } from '../../../app';
import { createTestFixtures, deleteTestFixtures } from './test-fixtures';

describe('GET /coupon/:couponId', () => {
  let server: FastifyInstance;
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

    await deleteTestFixtures(prisma);
    fixtures = await createTestFixtures(prisma);

    users = await prisma.user.findMany();
    // Generate a JWT token for testing
    jwtToken = server.jwt.sign({
      userId: users[0].id,
      username: users[0].username,
      role: 'admin',
    });
  });

  afterAll(async () => {
    await deleteTestFixtures(prisma);
    await server.close();
  });

  it('should return a coupon when given a valid ID', async () => {
    const couponId = fixtures[0].id;
    const response = await server.inject({
      method: 'GET',
      url: `/api/v1/coupon/${couponId}`,
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    expect(response.statusCode).toBe(200);
    const coupon = response.json();
    expect(coupon.id).toBe(couponId);
    expect(coupon.code).toBe(fixtures[0].code);
    expect(new Date(coupon.issuedAt)).toEqual(fixtures[0].issuedAt);
    expect(new Date(coupon.expiredAt)).toEqual(fixtures[0].expiredAt);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(new Decimal(coupon.price).equals(fixtures[0].price!)).toBeTruthy();
  });

  it('should return 404 when given a non-existent ID', async () => {
    const nonExistentId = 9999;
    const response = await server.inject({
      method: 'GET',
      url: `/api/v1/coupon/${nonExistentId}`,
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    expect(response.statusCode).toBe(404);
    const errorResponse = response.json();
    expect(errorResponse.message).toBe('Coupon not found');
  });

  it('should return 400 when given an invalid ID format', async () => {
    const invalidId = 'not-a-number';
    const response = await server.inject({
      method: 'GET',
      url: `/api/v1/coupon/${invalidId}`,
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
            "code": "invalid_type",
            "expected": "number",
            "message": "Expected number, received nan",
            "path": [],
            "received": "nan",
          },
        ],
        "name": "ZodValidationError",
      }
    `);
  });

  it('should return a coupon with null fields when applicable', async () => {
    const couponWithNulls = fixtures.find((c) => c.retrievedAt === null);
    if (!couponWithNulls) {
      throw new Error('Test fixture with null fields not found');
    }

    const response = await server.inject({
      method: 'GET',
      url: `/api/v1/coupon/${couponWithNulls.id}`,
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    expect(response.statusCode).toBe(200);
    const coupon = response.json();
    expect(coupon.id).toBe(couponWithNulls.id);
    expect(coupon.retrievedAt).toBeNull();
    expect(coupon.retrievedBy).toBeNull();
  });
});
