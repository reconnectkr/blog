import fastifyJwt from '@fastify/jwt';
import { Product, ProductInventoryItem, User } from '@prisma/client';
import {
  prisma,
  seedProduct,
  seedUser,
} from '@reconnect/prisma-repository-common';
import Fastify, { FastifyInstance } from 'fastify';
import { app, SECRET } from '../../../../../app';

describe('DELETE /api/v1/product/:productId/inventory-item/:inventoryItemId', () => {
  let server: FastifyInstance;
  let products: Product[];
  let product: Product;
  let productInventoryItems: ProductInventoryItem[];
  let productInventoryItem: ProductInventoryItem;
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
    products = await seedProduct(prisma);
    product = products[0];
    productInventoryItems = await prisma.productInventoryItem.findMany({
      orderBy: [
        {
          productId: 'asc',
        },
        {
          inventoryItem: {
            code: 'asc',
          },
        },
      ],
    });
    productInventoryItem = productInventoryItems[0];

    // Generate a JWT token for testing
    jwtToken = server.jwt.sign({
      userId: user.id,
      username: user.username,
      role: 'admin',
    });
  }

  async function deleteTestFixtures() {
    await prisma.productInventoryItem.deleteMany();
    await prisma.product.deleteMany();
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
      url: `/api/v1/product/${product.id}/inventory-item/${productInventoryItem.inventoryItemId}`,
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    expect(response.statusCode).toBe(204);
    expect(response.body).toBe('');

    // Verify the item has been deleted
    const deletedItem = await prisma.productInventoryItem.findUnique({
      where: {
        productId_inventoryItemId: {
          productId: product.id,
          inventoryItemId: productInventoryItem.inventoryItemId,
        },
      },
    });
    expect(deletedItem).toBeNull();
  });

  it('should return 404 if inventory item does not exist', async () => {
    const nonExistentId = 999999;
    const response = await server.inject({
      method: 'DELETE',
      url: `/api/v1/productInventoryItem/${nonExistentId}`,
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    expect(response.statusCode).toBe(404);
  });

  it('should return 401 if not authenticated', async () => {
    const response = await server.inject({
      method: 'DELETE',
      url: `/api/v1/product/${product.id}/inventory-item/${productInventoryItem.inventoryItemId}`,
    });

    expect(response.statusCode).toBe(401);
  });

  it('should return 400 if id is not a positive integer', async () => {
    const response = await server.inject({
      method: 'DELETE',
      url: `/api/v1/product/${product.id}/inventory-item/invalidInventoryItemId`,
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    expect(response.statusCode).toBe(400);
  });
});
