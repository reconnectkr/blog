import fastifyJwt from '@fastify/jwt';
import { Product, User } from '@prisma/client';
import {
  prisma,
  seedProduct,
  seedUser,
} from '@reconnect/prisma-repository-common';
import Fastify, { FastifyInstance } from 'fastify';
import { app, SECRET } from '../../../app';

describe('PATCH /api/v1/product/:productId', () => {
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
  });

  afterAll(async () => {
    await deleteTestFixtures();
    await server.close();
  });

  async function createTestFixtures() {
    users = await seedUser(prisma);
    user = users[0];
    products = await seedProduct(prisma);

    // Generate a JWT token for testing
    jwtToken = server.jwt.sign({
      userId: users[0].id,
      username: users[0].username,
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

  it('should update a product successfully', async () => {
    const productToUpdate = products[0];
    const updateData = {
      name: 'Updated Product Name',
      price: '29.99',
      description: 'Updated product description',
    };

    const response = await server.inject({
      method: 'PATCH',
      url: `/api/v1/product/${productToUpdate.id}`,
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      payload: updateData,
    });

    expect(response.statusCode).toBe(200);
    const updatedProduct = JSON.parse(response.payload);
    expect(updatedProduct).toMatchObject({
      id: productToUpdate.id,
      name: updateData.name,
      price: updateData.price,
      description: updateData.description,
      updatedBy: user.id,
    });

    // Verify the product was actually updated in the database
    const dbProduct = await prisma.product.findUniqueOrThrow({
      where: { id: productToUpdate.id },
    });
    expect({ ...dbProduct, price: dbProduct.price.toString() }).toMatchObject(
      updateData
    );
  });

  it('should return 404 if product does not exist', async () => {
    const nonExistentId = 999999;
    const updateData = {
      name: 'Updated Product Name',
    };

    const response = await server.inject({
      method: 'PATCH',
      url: `/api/v1/product/${nonExistentId}`,
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      payload: updateData,
    });

    expect(response.statusCode).toBe(404);
  });

  it('should return 400 for invalid input', async () => {
    const productToUpdate = products[0];
    const invalidUpdateData = {
      name: '', // Empty name should be invalid
      price: 'not a number',
    };

    const response = await server.inject({
      method: 'PATCH',
      url: `/api/v1/product/${productToUpdate.id}`,
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
    const productToUpdate = products[0];
    const updateData = {
      name: 'Updated Product Name',
    };

    const response = await server.inject({
      method: 'PATCH',
      url: `/api/v1/product/${productToUpdate.id}`,
      payload: updateData,
    });

    expect(response.statusCode).toBe(401);
  });
});
