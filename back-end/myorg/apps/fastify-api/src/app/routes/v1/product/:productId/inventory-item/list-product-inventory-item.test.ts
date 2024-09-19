import fastifyJwt from '@fastify/jwt';
import { Product, ProductInventoryItem, User } from '@prisma/client';
import {
  prisma,
  seedProduct,
  seedUser,
} from '@reconnect/prisma-repository-common';
import Fastify, { FastifyInstance } from 'fastify';
import { app, SECRET } from '../../../../../app';

describe('GET /api/v1/product/:productId/inventory-item', () => {
  let server: FastifyInstance;
  let products: Product[];
  let product: Product;
  let productInventoryItems: ProductInventoryItem[];
  let productInventoryItem: ProductInventoryItem;
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
    users = await seedUser(prisma);
    products = await seedProduct(prisma);
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
    product = products.find(
      (item) => item.id === productInventoryItem.productId
    )!;
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

  it('should return a list of productInventoryItems', async () => {
    const response = await server.inject({
      method: 'GET',
      url: `/api/v1/product/${product.id}/inventory-item`,
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body).toHaveProperty('items');
    expect(Array.isArray(body.items)).toBe(true);
    expect(body.items.length).toBe(
      productInventoryItems.filter((item) => item.productId === product.id)
        .length
    );
  });

  it('should filter productInventoryItems by inventoryItem name', async () => {
    const nameContains = '료';
    const response = await server.inject({
      method: 'GET',
      url: `/api/v1/product/${product.id}/inventory-item?filter[inventoryItem][name][contains]=${nameContains}`,
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    const pis = await prisma.productInventoryItem.findMany({
      where: {
        productId: product.id,
        inventoryItem: {
          name: {
            contains: nameContains,
          },
        },
      },
      select: {
        productId: true,
        inventoryItem: {
          select: { id: true, name: true },
        },
      },
      orderBy: [
        { productId: 'asc' },
        {
          inventoryItem: {
            id: 'asc',
          },
        },
      ],
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(pis).toEqual(
      body.items.map(
        (item: { productId: any; inventoryItem: { id: any; name: any } }) => ({
          productId: item.productId,
          inventoryItem: {
            id: item.inventoryItem.id,
            name: item.inventoryItem.name,
          },
        })
      )
    );
  });

  it('should order productInventoryItems by name descending', async () => {
    const response = await server.inject({
      method: 'GET',
      url: `/api/v1/product/${product.id}/inventory-item?orderBy[name]=desc`,
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    const names = body.items.map((item: { name: string }) => item.name);
    expect(names).toEqual([...names].sort().reverse());
  });

  it('should paginate results', async () => {
    const pageSize = 1;
    const response = await server.inject({
      method: 'GET',
      url: `/api/v1/product/${product.id}/inventory-item?page=1&pageSize=${pageSize}`,
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.items.length).toBe(pageSize);
  });

  it('should return 401 if not authenticated', async () => {
    const response = await server.inject({
      method: 'GET',
      url: `/api/v1/product/${product.id}/inventory-item`,
    });

    expect(response.statusCode).toBe(401);
  });

  it('should return 400 for invalid query parameters', async () => {
    const response = await server.inject({
      method: 'GET',
      url: `/api/v1/product/${product.id}/inventory-item?invalidQueryParam=1000`,
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    expect(response.statusCode).toBe(400);
  });
});
