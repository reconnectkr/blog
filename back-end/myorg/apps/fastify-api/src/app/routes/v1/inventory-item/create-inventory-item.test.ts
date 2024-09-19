import fastifyJwt from '@fastify/jwt';
import { InventoryItem, User } from '@prisma/client';
import {
  prisma,
  seedInventoryItem,
  seedUser,
} from '@reconnect/prisma-repository-common';
import Fastify, { FastifyInstance } from 'fastify';
import { app, SECRET } from '../../../app';

describe('POST /api/v1/inventory-item', () => {
  let server: FastifyInstance;
  let inventoryItems: InventoryItem[];
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
    user = users[0];
    inventoryItems = await seedInventoryItem(prisma);
  }

  async function deleteTestFixtures() {
    await prisma.inventoryItem.deleteMany();
    await prisma.inventoryItemCategory.deleteMany();
    await prisma.inventoryItemCategoryType.deleteMany();
    await prisma.unit.deleteMany();
    await prisma.unitType.deleteMany();
    await prisma.user.deleteMany();
  }

  it('should create a new inventory item', async () => {
    const unit = await prisma.unit.findFirstOrThrow();
    const category = await prisma.inventoryItemCategory.findFirstOrThrow();

    const newItem = {
      code: 'TEST001',
      name: 'Test Item',
      specification: 'Test Spec',
      manufacturer: 'Test Manufacturer',
      inventoryUnitId: unit.id,
      description: 'Test Description',
      barcode: '1234567890',
      active: true,
      categoryId: category.id,
    };

    const response = await server.inject({
      method: 'POST',
      url: '/api/v1/inventory-item',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      payload: newItem,
    });

    expect(response.statusCode).toBe(201);
    const responseBody = JSON.parse(response.body);
    expect(responseBody).toMatchObject({
      ...newItem,
      createdBy: user.id,
    });
    expect(responseBody).toHaveProperty('id');
  });

  it('should return 400 for invalid input', async () => {
    const invalidItem = {
      // Missing required fields
      code: 'TEST002',
      name: 'Invalid Item',
    };

    const response = await server.inject({
      method: 'POST',
      url: '/api/v1/inventory-item',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      payload: invalidItem,
    });

    expect(response.statusCode).toBe(400);
  });

  it('should return 401 for unauthorized access', async () => {
    const newItem = {
      code: 'TEST003',
      name: 'Unauthorized Item',
      specification: 'Test Spec',
      manufacturer: 'Test Manufacturer',
      inventoryUnitId: 1,
      createdAt: new Date(),
      createdBy: 'test-user',
    };

    const response = await server.inject({
      method: 'POST',
      url: '/api/v1/inventory-item',
      payload: newItem,
    });

    expect(response.statusCode).toBe(401);
  });
});
