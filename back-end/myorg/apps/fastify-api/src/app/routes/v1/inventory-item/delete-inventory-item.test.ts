import fastifyJwt from '@fastify/jwt';
import { InventoryItem, User } from '@prisma/client';
import {
  prisma,
  seedInventoryItem,
  seedUser,
} from '@reconnect/prisma-repository-common';
import Fastify, { FastifyInstance } from 'fastify';
import { app, SECRET } from '../../../app';

describe('DELETE /api/v1/inventory-item/:id', () => {
  let server: FastifyInstance;
  let inventoryItems: InventoryItem[];
  let users: User[];
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
    await seedUser(prisma);
    users = await prisma.user.findMany();
    await seedInventoryItem(prisma);
    inventoryItems = await prisma.inventoryItem.findMany({
      orderBy: { id: 'asc' },
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
  it('should delete an inventory item successfully', async () => {
    const response = await server.inject({
      method: 'DELETE',
      url: `/api/v1/inventory-item/${inventoryItems[0].id}`,
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    expect(response.statusCode).toBe(204);
    expect(response.body).toBe('');

    // Verify the item has been deleted
    const deletedItem = await prisma.inventoryItem.findUnique({
      where: { id: inventoryItems[0].id },
    });
    expect(deletedItem).toBeNull();
  });

  it('should return 404 if inventory item does not exist', async () => {
    const nonExistentId = 999999;
    const response = await server.inject({
      method: 'DELETE',
      url: `/api/v1/inventory-item/${nonExistentId}`,
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    expect(response.statusCode).toBe(404);
  });

  it('should return 401 if not authenticated', async () => {
    const response = await server.inject({
      method: 'DELETE',
      url: `/api/v1/inventory-item/${inventoryItems[0].id}`,
    });

    expect(response.statusCode).toBe(401);
  });

  it('should return 400 if id is not a positive integer', async () => {
    const response = await server.inject({
      method: 'DELETE',
      url: '/api/v1/inventory-item/invalid',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    expect(response.statusCode).toBe(400);
  });
});
