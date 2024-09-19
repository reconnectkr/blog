import fastifyJwt from '@fastify/jwt';
import { Coupon, PrismaClient, User } from '@prisma/client';
import Fastify, { FastifyInstance } from 'fastify';
import { app, SECRET } from '../../../app';
import { createTestFixtures, deleteTestFixtures } from './test-fixtures';

describe('DELETE /coupon/:couponId', () => {
  let server: FastifyInstance;
  let prisma: PrismaClient;
  let fixtures: Coupon[];
  let jwtToken: string;
  let users: User[];
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

  it('should delete a coupon when given a valid ID', async () => {
    const couponId = fixtures[0].id;

    const response = await server.inject({
      method: 'DELETE',
      url: `/api/v1/coupon/${couponId}`,
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    expect(response.statusCode).toBe(204);
    expect(response.body).toBe('');

    // Verify the coupon was actually deleted from the database
    const deletedCoupon = await prisma.coupon.findUnique({
      where: { id: couponId },
    });
    expect(deletedCoupon).toBeNull();
  });

  it('should return 404 when trying to delete a non-existent coupon', async () => {
    const nonExistentId = 9999;

    const response = await server.inject({
      method: 'DELETE',
      url: `/api/v1/coupon/${nonExistentId}`,
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    expect(response.statusCode).toBe(404);
    const errorResponse = JSON.parse(response.body);
    expect(errorResponse.message).toBe('Coupon not found');
  });

  it('should return 400 when given an invalid ID format', async () => {
    const invalidId = 'not-a-number';

    const response = await server.inject({
      method: 'DELETE',
      url: `/api/v1/coupon/${invalidId}`,
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    expect(response.statusCode).toBe(400);
    const errorResponse = JSON.parse(response.body);
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

  it('should not affect other coupons when deleting one', async () => {
    const couponIdToDelete = fixtures[0].id;
    const otherCouponId = fixtures[1].id;

    await server.inject({
      method: 'DELETE',
      url: `/api/v1/coupon/${couponIdToDelete}`,
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    // Verify the other coupon still exists
    const otherCoupon = await prisma.coupon.findUnique({
      where: { id: otherCouponId },
    });
    expect(otherCoupon).not.toBeNull();
    expect(otherCoupon?.id).toBe(otherCouponId);
  });

  it('should handle deletion of already deleted coupon', async () => {
    const couponId = fixtures[0].id;

    // Delete the coupon for the first time
    await server.inject({
      method: 'DELETE',
      url: `/api/v1/coupon/${couponId}`,
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    // Try to delete the same coupon again
    const response = await server.inject({
      method: 'DELETE',
      url: `/api/v1/coupon/${couponId}`,
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    expect(response.statusCode).toBe(404);
    const errorResponse = JSON.parse(response.body);
    expect(errorResponse.message).toBe('Coupon not found');
  });
});
