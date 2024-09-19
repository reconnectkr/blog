import fastifyJwt from '@fastify/jwt';
import { User } from '@prisma/client';
import {
  CreateCouponRequest,
  CreateCouponResponse,
} from '@reconnect/coupon-dto';
import { prisma, seedUser } from '@reconnect/prisma-repository-common';
import { Decimal } from 'decimal.js';
import Fastify, { FastifyInstance } from 'fastify';
import { DateTime } from 'luxon';
import { app, SECRET } from '../../../app';

describe('POST /coupon', () => {
  let server: FastifyInstance;
  let jwtToken: string;
  let users: User[];
  let user: User;

  beforeAll(async () => {
    server = Fastify();
    server.register(app);
    server.register(fastifyJwt, {
      secret: SECRET,
    });
    await server.ready();

    await prisma.coupon.deleteMany();
    await prisma.user.deleteMany();
    users = await seedUser(prisma);
    user = users[0];

    // Generate a JWT token for testing
    jwtToken = server.jwt.sign({
      userId: users[0].id,
      username: users[0].username,
      role: 'admin',
    });
  });

  afterEach(async () => {
    await prisma.coupon.deleteMany();
  });

  afterAll(async () => {
    await server.close();
    await prisma.user.deleteMany();
  });

  it('should create a new coupon', async () => {
    const now = DateTime.now();
    const couponData: CreateCouponRequest = {
      code: 'NEWCOUPON',
      issuedAt: now.toJSDate(),
      expiredAt: now.plus({ days: 30 }).toJSDate(),
      price: new Decimal(100.0),
      rate: null,
    };

    const response = await server.inject({
      method: 'POST',
      url: '/api/v1/coupon',
      payload: couponData,
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    expect(response.statusCode).toBe(201);
    const responseJson = response.json() as CreateCouponResponse;
    expect(responseJson.id).toBeDefined();
    expect(responseJson.code).toBe(couponData.code);
    expect(responseJson.issuedBy).toBe(user.id);
    expect(new Date(responseJson.issuedAt)).toEqual(couponData.issuedAt);
    expect(new Date(responseJson.expiredAt)).toEqual(couponData.expiredAt);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(new Decimal(responseJson.price!)).toEqual(couponData.price);
    expect(responseJson.rate).toBeNull();

    // Verify the coupon was actually created in the database
    const createdCoupon = await prisma.coupon.findUnique({
      where: { id: responseJson.id },
    });
    expect(createdCoupon).toBeDefined();
    expect(createdCoupon?.code).toBe(couponData.code);
  });

  it('should create a new coupon without issuedBy', async () => {
    const now = DateTime.now();
    const couponData: CreateCouponRequest = {
      code: 'NEWCOUPON',
      issuedAt: now.toJSDate(),
      expiredAt: now.plus({ days: 30 }).toJSDate(),
      price: new Decimal(100.0),
      rate: null,
    };

    const response = await server.inject({
      method: 'POST',
      url: '/api/v1/coupon',
      payload: couponData,
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    expect(response.statusCode).toBe(201);
    const responseJson = response.json() as CreateCouponResponse;
    expect(responseJson.id).toBeDefined();
    expect(responseJson.code).toBe(couponData.code);
    expect(responseJson.issuedBy).toBe(users[0].id);
    expect(new Date(responseJson.issuedAt)).toEqual(couponData.issuedAt);
    expect(new Date(responseJson.expiredAt)).toEqual(couponData.expiredAt);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(new Decimal(responseJson.price!)).toEqual(couponData.price);
    expect(responseJson.rate).toBeNull();

    // Verify the coupon was actually created in the database
    const createdCoupon = await prisma.coupon.findUnique({
      where: { id: responseJson.id },
    });
    expect(createdCoupon).toBeDefined();
    expect(createdCoupon?.code).toBe(couponData.code);
  });

  it('should create a coupon with rate instead of price', async () => {
    const now = DateTime.now();
    const couponData: CreateCouponRequest = {
      code: 'RATECOUPON',
      issuedAt: now.toJSDate(),
      expiredAt: now.plus({ days: 15 }).toJSDate(),
      price: null,
      rate: new Decimal(0.15),
    };

    const response = await server.inject({
      method: 'POST',
      url: '/api/v1/coupon',
      payload: couponData,
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    expect(response.statusCode).toBe(201);
    const responseJson = response.json() as CreateCouponResponse;
    expect(responseJson.id).toBeDefined();
    expect(responseJson.code).toBe(couponData.code);
    expect(responseJson.price).toBeNull();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(new Decimal(responseJson.rate!)).toEqual(couponData.rate);
  });

  it('should return 400 for invalid input', async () => {
    const invalidCouponData = {
      code: 'INVALID',
      issuedBy: 'SYSTEM',
      // Missing required fields
    };

    const response = await server.inject({
      method: 'POST',
      url: '/api/v1/coupon',
      payload: invalidCouponData,
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    expect(response.statusCode).toBe(400);
    const responseJson = response.json();
    expect(responseJson.message).toBeDefined();
  });

  it('should not allow creation of coupon with duplicate code', async () => {
    const now = DateTime.now();
    const couponData: CreateCouponRequest = {
      code: 'DUPLICATECODE',
      issuedAt: now.toJSDate(),
      expiredAt: now.plus({ days: 30 }).toJSDate(),
      price: new Decimal(100.0),
    };

    // Create the first coupon
    await server.inject({
      method: 'POST',
      url: '/api/v1/coupon',
      payload: couponData,
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    // Attempt to create a second coupon with the same code
    const response = await server.inject({
      method: 'POST',
      url: '/api/v1/coupon',
      payload: couponData,
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    expect(response.statusCode).toBe(400);
    const responseJson = response.json();
    expect(responseJson.message).toContain('Unique constraint failed');
  });
});
