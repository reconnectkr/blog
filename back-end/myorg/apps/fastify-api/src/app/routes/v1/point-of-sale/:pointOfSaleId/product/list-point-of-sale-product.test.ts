import fastifyJwt from '@fastify/jwt';
import { PointOfSale, PointOfSaleProduct, Product, User } from '@prisma/client';
import {
  prisma,
  seedPointOfSale,
  seedPointOfSaleProduct,
  seedProduct,
  seedUser,
} from '@reconnect/prisma-repository-common';
import Fastify, { FastifyInstance } from 'fastify';
import { app, SECRET } from '../../../../../app';

describe('GET /api/v1/point-of-sale/:pointOfSaleId/product', () => {
  let server: FastifyInstance;
  let products: Product[];
  let product: Product;
  let pointOfSaleProducts: PointOfSaleProduct[];
  let pointOfSaleProduct: PointOfSaleProduct;
  let pointOfSales: PointOfSale[];
  let pointOfSale: PointOfSale;
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
    pointOfSales = await seedPointOfSale(prisma);
    pointOfSale = pointOfSales[0];
    pointOfSaleProducts = await seedPointOfSaleProduct(prisma);
    pointOfSaleProducts = await prisma.pointOfSaleProduct.findMany({
      orderBy: [
        {
          pointOfSaleId: 'asc',
        },
        {
          productId: 'asc',
        },
      ],
    });
    pointOfSaleProduct = pointOfSaleProducts[0];

    // Generate a JWT token for testing
    jwtToken = server.jwt.sign({
      userId: user.id,
      username: user.username,
      role: 'admin',
    });
  }

  async function deleteTestFixtures() {
    await prisma.pointOfSaleProduct.deleteMany();
    await prisma.pointOfSale.deleteMany();
    await prisma.productInventoryItem.deleteMany();
    await prisma.product.deleteMany();
    await prisma.inventoryItem.deleteMany();
    await prisma.inventoryItemCategory.deleteMany();
    await prisma.inventoryItemCategoryType.deleteMany();
    await prisma.unit.deleteMany();
    await prisma.unitType.deleteMany();
    await prisma.user.deleteMany();
    await prisma.department.deleteMany();
  }

  it('should return a list of pointOfSaleProducts', async () => {
    const response = await server.inject({
      method: 'GET',
      url: `/api/v1/point-of-sale/${pointOfSale.id}/product`,
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    const posp = await prisma.pointOfSaleProduct.findMany({
      where: {
        pointOfSaleId: pointOfSale.id,
      },
      select: {
        product: {
          select: { id: true, name: true, price: true, description: true },
        },
        createdAt: true,
        createdBy: true,
      },
      orderBy: [{ pointOfSaleId: 'asc' }, { productId: 'asc' }],
    });
    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body).toHaveProperty('items');
    posp.forEach((item, index) => {
      expect(body.items[index].product.id).toBe(item.product.id);
      expect(body.items[index].product.name).toBe(item.product.name);
      expect(body.items[index].product.price).toBe(
        item.product.price.toString()
      );
      expect(body.items[index].product.description).toBe(
        item.product.description
      );
      expect(body.items[index].createdAt).toBe(item.createdAt.toISOString());
      expect(body.items[index].createdBy).toBe(item.createdBy);
    });
  });

  it('should filter pointOfSaleProducts by product name', async () => {
    const nameContains = '료';
    const response = await server.inject({
      method: 'GET',
      url: `/api/v1/point-of-sale/${pointOfSale.id}/product?filter[product][name][contains]=${nameContains}`,
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    const posp = await prisma.pointOfSaleProduct.findMany({
      where: {
        pointOfSaleId: pointOfSale.id,
        product: {
          name: {
            contains: nameContains,
          },
        },
      },
      select: {
        product: {
          select: { id: true, name: true, price: true, description: true },
        },
        createdAt: true,
        createdBy: true,
      },
      orderBy: [{ pointOfSaleId: 'asc' }, { productId: 'asc' }],
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.items.length).toBe(posp.length);
    posp.forEach((item, index) => {
      expect(body.items[index].product.id).toBe(item.product.id);
      expect(body.items[index].product.name).toBe(item.product.name);
      expect(body.items[index].product.price).toBe(
        item.product.price.toString()
      );
      expect(body.items[index].product.description).toBe(
        item.product.description
      );
      expect(body.items[index].createdAt).toBe(item.createdAt.toISOString());
      expect(body.items[index].createdBy).toBe(item.createdBy);
    });
  });

  it('should order pointOfSaleProducts by name descending', async () => {
    const response = await server.inject({
      method: 'GET',
      url: `/api/v1/point-of-sale/${pointOfSale.id}/product?orderBy[name]=desc`,
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
    const pageSize = 2;
    const response = await server.inject({
      method: 'GET',
      url: `/api/v1/point-of-sale/${pointOfSale.id}/product?page=1&pageSize=${pageSize}`,
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
      url: `/api/v1/point-of-sale/${pointOfSale.id}/product`,
    });

    expect(response.statusCode).toBe(401);
  });

  it('should return 400 for invalid query parameters', async () => {
    const response = await server.inject({
      method: 'GET',
      url: `/api/v1/point-of-sale/${pointOfSale.id}/product?invalidQueryParam=1000`,
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    expect(response.statusCode).toBe(400);
  });
});
