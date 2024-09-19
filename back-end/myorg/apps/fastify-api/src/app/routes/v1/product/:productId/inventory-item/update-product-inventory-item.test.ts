import fastifyJwt from '@fastify/jwt';
import { Product, ProductInventoryItem, User } from '@prisma/client';
import {
  prisma,
  seedProduct,
  seedUser,
} from '@reconnect/prisma-repository-common';
import Fastify, { FastifyInstance } from 'fastify';
import { app, SECRET } from '../../../../../app';

describe('PATCH /api/v1/product/:productId/inventory-item/:inventoryItemId', () => {
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

  it('should update a productInventoryItem successfully', async () => {
    const productInventoryItemToUpdate = productInventoryItems[0];
    const updateData = {
      quantity: '90',
    };

    const response = await server.inject({
      method: 'PATCH',
      url: `/api/v1/product/${product.id}/inventory-item/${productInventoryItem.inventoryItemId}`,
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      payload: updateData,
    });

    expect(response.statusCode).toBe(200);
    const updatedProductInventoryItem = JSON.parse(response.payload);
    expect(updatedProductInventoryItem).toMatchObject({
      productId: product.id,
      inventoryItemId: productInventoryItem.inventoryItemId,
      quantity: updateData.quantity,
    });

    // Verify the productInventoryItem was actually updated in the database
    const dbProductInventoryItem =
      await prisma.productInventoryItem.findUniqueOrThrow({
        where: {
          productId_inventoryItemId: {
            productId: product.id,
            inventoryItemId: productInventoryItem.inventoryItemId,
          },
        },
      });
    expect({
      ...dbProductInventoryItem,
      quantity: dbProductInventoryItem.quantity.toString(),
    }).toMatchObject(updateData);
  });

  it('should return 404 if productInventoryItem does not exist', async () => {
    const nonExistentId = 999999;
    const updateData = {
      name: 'Updated ProductInventoryItem Name',
    };

    const response = await server.inject({
      method: 'PATCH',
      url: `/api/v1/productInventoryItem/${nonExistentId}`,
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      payload: updateData,
    });

    expect(response.statusCode).toBe(404);
  });

  it('should return 400 for invalid input', async () => {
    const productInventoryItemToUpdate = productInventoryItems[0];
    const invalidUpdateData = {
      name: '', // Empty name should be invalid
      price: 'not a number',
    };

    const response = await server.inject({
      method: 'PATCH',
      url: `/api/v1/product/${product.id}/inventory-item/${productInventoryItem.inventoryItemId}`,
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      payload: invalidUpdateData,
    });

    expect(response.statusCode).toBe(400);
    const error = JSON.parse(response.payload);
    expect(error).toHaveProperty('message');
  });

  it('should return 401 if not authenticated', async () => {
    const productInventoryItemToUpdate = productInventoryItems[0];
    const updateData = {
      name: 'Updated ProductInventoryItem Name',
    };

    const response = await server.inject({
      method: 'PATCH',
      url: `/api/v1/product/${product.id}/inventory-item/${productInventoryItem.inventoryItemId}`,
      payload: updateData,
    });

    expect(response.statusCode).toBe(401);
  });
});
