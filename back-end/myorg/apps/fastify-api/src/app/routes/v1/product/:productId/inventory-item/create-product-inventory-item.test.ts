import fastifyJwt from '@fastify/jwt';
import {
  InventoryItem,
  Product,
  ProductInventoryItem,
  User,
} from '@prisma/client';
import {
  prisma,
  seedProduct,
  seedUser,
} from '@reconnect/prisma-repository-common';
import { Decimal } from 'decimal.js';
import Fastify, { FastifyInstance } from 'fastify';
import { app, SECRET } from '../../../../../app';

describe('POST /api/v1/product/:productId/inventory-item', () => {
  let server: FastifyInstance;
  let products: Product[];
  let product: Product;
  let productInventoryItems: ProductInventoryItem[];
  let inventoryItem: InventoryItem;
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
    inventoryItem = await prisma.inventoryItem.findFirstOrThrow({
      where: {
        id: productInventoryItems[0].inventoryItemId,
      },
    });
    await prisma.productInventoryItem.delete({
      where: {
        productId_inventoryItemId: {
          productId: product.id,
          inventoryItemId: inventoryItem.id,
        },
      },
    });

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

  it('should create a new productInventoryItem', async () => {
    const newProductInventoryItem = {
      inventoryItemId: inventoryItem.id,
      quantity: new Decimal(1),
    };

    const response = await server.inject({
      method: 'POST',
      url: `/api/v1/product/${product.id}/inventory-item`,
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      payload: newProductInventoryItem,
    });

    expect(response.statusCode).toBe(201);
    const createdProductInventoryItem = JSON.parse(response.payload);
    expect(createdProductInventoryItem).toMatchObject({
      productId: product.id,
      inventoryItemId: newProductInventoryItem.inventoryItemId,
      quantity: newProductInventoryItem.quantity.toString(),
      createdAt: expect.any(String),
      createdBy: user.id,
      updatedAt: expect.any(String),
      updatedBy: user.id,
    });

    // Verify the productInventoryItem was actually created in the database
    const dbProductInventoryItem =
      await prisma.productInventoryItem.findUniqueOrThrow({
        where: {
          productId_inventoryItemId: {
            productId: product.id,
            inventoryItemId: createdProductInventoryItem.inventoryItemId,
          },
        },
      });
    expect(dbProductInventoryItem.productId).toBe(product.id);
    expect(dbProductInventoryItem.inventoryItemId).toBe(
      createdProductInventoryItem.inventoryItemId
    );
    expect(dbProductInventoryItem.quantity.toString()).toEqual(
      createdProductInventoryItem.quantity
    );
    expect(dbProductInventoryItem.createdAt).toEqual(
      new Date(createdProductInventoryItem.createdAt)
    );
    expect(dbProductInventoryItem.createdBy).toBe(user.id);
    expect(dbProductInventoryItem.updatedAt).toEqual(
      new Date(createdProductInventoryItem.updatedAt)
    );
    expect(dbProductInventoryItem.updatedBy).toBe(user.id);
  });

  it('should return 400 for invalid input', async () => {
    const invalidProductInventoryItem = {
      name: '', // Empty name should be invalid
      price: 'not a number',
      description: null,
    };

    const response = await server.inject({
      method: 'POST',
      url: `/api/v1/product/${product.id}/inventory-item`,
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      payload: invalidProductInventoryItem,
    });

    expect(response.statusCode).toBe(400);
    const error = JSON.parse(response.payload);
    expect(error).toHaveProperty('message');
  });

  it('should return 401 if not authenticated', async () => {
    const newProductInventoryItem = {
      name: 'Test ProductInventoryItem',
      price: '19.99',
      description: 'This is a test productInventoryItem',
    };

    const response = await server.inject({
      method: 'POST',
      url: `/api/v1/product/${product.id}/inventory-item`,
      payload: newProductInventoryItem,
    });

    expect(response.statusCode).toBe(401);
  });
});
