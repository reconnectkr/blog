import fastifyJwt from '@fastify/jwt';
import { Product, User } from '@prisma/client';
import {
  prisma,
  seedProduct,
  seedUser,
} from '@reconnect/prisma-repository-common';
import Fastify, { FastifyInstance } from 'fastify';
import { app, SECRET } from '../../../app';

describe('POST /api/v1/product', () => {
  let server: FastifyInstance;
  let products: Product[];
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

  it('should create a new product', async () => {
    const newProduct = {
      name: 'Test Product',
      price: '19.99',
      description: 'This is a test product',
    };

    const response = await server.inject({
      method: 'POST',
      url: '/api/v1/product',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      payload: newProduct,
    });

    expect(response.statusCode).toBe(201);
    const createdProduct = JSON.parse(response.payload);
    expect(createdProduct).toMatchObject({
      name: newProduct.name,
      price: newProduct.price,
      description: newProduct.description,
      id: expect.any(Number),
      createdAt: expect.any(String),
      createdBy: user.id,
      updatedAt: expect.any(String),
      updatedBy: user.id,
    });

    // Verify the product was actually created in the database
    const dbProduct = await prisma.product.findUnique({
      where: { id: createdProduct.id },
    });
    expect(dbProduct).not.toBeNull();
    expect(dbProduct?.name).toBe(newProduct.name);
  });

  it('should return 400 for invalid input', async () => {
    const invalidProduct = {
      name: '', // Empty name should be invalid
      price: 'not a number',
      description: null,
    };

    const response = await server.inject({
      method: 'POST',
      url: '/api/v1/product',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      payload: invalidProduct,
    });

    expect(response.statusCode).toBe(400);
    const error = JSON.parse(response.payload);
    expect(error).toHaveProperty('message');
  });

  it('should return 401 if not authenticated', async () => {
    const newProduct = {
      name: 'Test Product',
      price: '19.99',
      description: 'This is a test product',
    };

    const response = await server.inject({
      method: 'POST',
      url: '/api/v1/product',
      payload: newProduct,
    });

    expect(response.statusCode).toBe(401);
  });
});
