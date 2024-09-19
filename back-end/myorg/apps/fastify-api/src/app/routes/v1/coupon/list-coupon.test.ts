import fastifyJwt from '@fastify/jwt';
import { Coupon, User } from '@prisma/client';
import { prisma } from '@reconnect/prisma-repository-common';
import Fastify, { FastifyInstance } from 'fastify';
import { app, SECRET } from '../../../app';
import { createTestFixtures, deleteTestFixtures } from './test-fixtures';

describe('GET /coupon/', () => {
  let server: FastifyInstance;
  let jwtToken: string;
  let fixtures: Coupon[];
  let users: User[];

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

  it('should return all coupons with default pagination and sorting', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/api/v1/coupon',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    const responseJson = response.json();
    expect(responseJson.items).toHaveLength(5);
    expect(responseJson.items[0].id).toBe(fixtures[0].id);
  });

  it('should return coupons with custom pagination', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/api/v1/coupon?page=2&pageSize=2',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    const responseJson = response.json();
    expect(responseJson.items).toHaveLength(2);
    expect(responseJson.items[0].id).toBe(fixtures[2].id);
  });

  it('should return coupons sorted by expiredAt in descending order', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/api/v1/coupon?orderBy[expiredAt]=desc',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    const responseJson = response.json();
    expect(responseJson.items).toHaveLength(5);
    expect(new Date(responseJson.items[0].expiredAt).getTime()).toBeGreaterThan(
      new Date(responseJson.items[1].expiredAt).getTime()
    );
  });

  it('should return filtered coupons', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/api/v1/coupon?filter[price][gte]=75',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    const responseJson = response.json();
    expect(
      responseJson.items.every(
        (coupon: { price: number }) => coupon.price >= 75
      )
    ).toBe(true);
  });

  it('should handle multiple filters, custom sorting and pagination', async () => {
    const issuedBy = users[0];
    const response = await server.inject({
      method: 'GET',
      url: `/api/v1/coupon?filter[price][gte]=50&filter[issuedBy]=${issuedBy.id}&orderBy[price][sort]=desc&orderBy[price][nulls]=last&page=1&pageSize=2`,
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    const responseJson = response.json();

    expect(responseJson.items).toHaveLength(2);
    expect(
      responseJson.items.every(
        (coupon: { price: number; issuedBy: string }) =>
          coupon.price >= 50 && coupon.issuedBy === issuedBy.id
      )
    ).toBe(true);
    expect(parseFloat(responseJson.items[0].price)).toBeGreaterThanOrEqual(
      parseFloat(responseJson.items[1].price)
    );
  });
});
