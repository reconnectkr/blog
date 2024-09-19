import fastifyJwt from '@fastify/jwt';
import { Product, ProductInventoryItem, User } from '@prisma/client';
import {
  prisma,
  seedProduct,
  seedUser,
} from '@reconnect/prisma-repository-common';
import Fastify, { FastifyInstance } from 'fastify';
import { app, SECRET } from '../../../../../app';

describe('GET /api/v1/product/:productId/inventory-item/:inventoryItemId', () => {
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
  it('should return a productInventoryItem when given a valid ID', async () => {
    const response = await server.inject({
      method: 'GET',
      url: `/api/v1/product/${product.id}/inventory-item/${productInventoryItem.inventoryItemId}`,
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    const inventoryItem = await getInventoryItem(
      productInventoryItem.inventoryItemId
    );

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body).toMatchObject({
      productId: product.id,
      inventoryItem: {
        id: inventoryItem.id,
        code: inventoryItem.code,
        name: inventoryItem.name,
        specification: inventoryItem.specification,
        inventoryUnit: inventoryItem.inventoryUnit,
        category: inventoryItem.category,
      },
      quantity: productInventoryItem.quantity.toString(),
      createdAt: productInventoryItem.createdAt.toISOString(),
      createdBy: productInventoryItem.createdBy,
      updatedAt: productInventoryItem.updatedAt.toISOString(),
      updatedBy: productInventoryItem.updatedBy,
    });
  });

  it('should return 404 when given an invalid ID', async () => {
    const invalidId = 9999;
    const response = await server.inject({
      method: 'GET',
      url: `/api/v1/product/${product.id}/inventory-item/${invalidId}`,
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    expect(response.statusCode).toBe(404);
  });

  it('should return 401 when no JWT token is provided', async () => {
    const response = await server.inject({
      method: 'GET',
      url: `/api/v1/product/${product.id}/inventory-item/${productInventoryItem.inventoryItemId}`,
    });

    expect(response.statusCode).toBe(401);
  });

  it('should return 400 when given a non-numeric ID', async () => {
    const response = await server.inject({
      method: 'GET',
      url: `/api/v1/product/${product.id}/inventory-item/invalidId`,
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    expect(response.statusCode).toBe(400);
  });
});

async function getInventoryItem(id: number) {
  return await prisma.inventoryItem.findFirstOrThrow({
    where: {
      id,
    },
    include: {
      inventoryUnit: {
        select: {
          id: true,
          name: true,
        },
      },
      category: {
        select: {
          id: true,
          name: true,
          typeId: true,
          parentId: true,
        },
      },
    },
  });
}
