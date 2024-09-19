import fastifyJwt from '@fastify/jwt';
import { InventoryItem, User } from '@prisma/client';
import {
  prisma,
  seedInventoryItem,
  seedUser,
} from '@reconnect/prisma-repository-common';
import Fastify, { FastifyInstance } from 'fastify';
import { app, SECRET } from '../../../app';

describe('PATCH /api/v1/inventory-item/:inventoryItemId', () => {
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
  });

  afterAll(async () => {
    await deleteTestFixtures();
    await server.close();
  });

  async function createTestFixtures() {
    users = await seedUser(prisma);
    user = users[0];
    inventoryItems = await seedInventoryItem(prisma);

    // Generate a JWT token for testing
    jwtToken = server.jwt.sign({
      userId: users[0].id,
      username: users[0].username,
      role: 'admin',
    });
  }

  async function deleteTestFixtures() {
    await prisma.inventoryItem.deleteMany();
    await prisma.inventoryItemCategory.deleteMany();
    await prisma.inventoryItemCategoryType.deleteMany();
    await prisma.unit.deleteMany();
    await prisma.unitType.deleteMany();
    await prisma.user.deleteMany();
  }

  it('should update an inventory item successfully', async () => {
    const updateData = {
      name: 'Updated Item Name',
      specification: 'New Specification',
      active: false,
    };

    const response = await server.inject({
      method: 'PATCH',
      url: `/api/v1/inventory-item/${inventoryItems[0].id}`,
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      payload: updateData,
    });

    expect(response.statusCode).toBe(200);
    const updatedItem = JSON.parse(response.payload);
    expect(updatedItem).toMatchObject({
      id: inventoryItems[0].id,
      name: updateData.name,
      specification: updateData.specification,
      active: updateData.active,
    });
    expect(updatedItem.updatedAt).toBeTruthy();
    expect(updatedItem.updatedBy).toBe(user.id);
  });

  it('should return 400 for invalid input', async () => {
    const invalidData = {
      inventoryUnitId: 'not a number',
    };

    const response = await server.inject({
      method: 'PATCH',
      url: `/api/v1/inventory-item/${inventoryItems[0].id}`,
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      payload: invalidData,
    });

    expect(response.statusCode).toBe(400);
  });

  it('should return 404 for non-existent inventory item', async () => {
    const nonExistentId = 99999;
    const updateData = { name: 'Test Update' };

    const response = await server.inject({
      method: 'PATCH',
      url: `/api/v1/inventory-item/${nonExistentId}`,
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      payload: updateData,
    });

    expect(response.statusCode).toBe(404);
  });

  it('should return 401 for unauthorized access', async () => {
    const updateData = { name: 'Test Update' };

    const response = await server.inject({
      method: 'PATCH',
      url: `/api/v1/inventory-item/${inventoryItems[0].id}`,
      payload: updateData,
    });

    expect(response.statusCode).toBe(401);
  });
});
