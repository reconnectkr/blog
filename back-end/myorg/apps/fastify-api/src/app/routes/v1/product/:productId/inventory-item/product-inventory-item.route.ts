import { Prisma, PrismaClient } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PAGE_SIZE_DEFAULT, PAGE_SIZE_MAX } from '@reconnect/zod-common';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import {
  CreateProductInventoryItemRequest,
  CreateProductInventoryItemRequestSchema,
  CreateProductInventoryItemResponse,
} from './create-product-inventory-item.dto';
import { DeleteProductInventoryItemResponse } from './delete-product-inventory-item.dto';
import {
  GetProductInventoryItemResponse,
  InventoryItemIdPathParamSchema,
  ProductIdPathParamSchema,
} from './get-product-inventory-item.dto';
import {
  ListProductInventoryItemQueryStringSchema,
  ListProductInventoryItemResponse,
} from './list-product-inventory-item.dto';
import {
  UpdateProductInventoryItemRequestSchema,
  UpdateProductInventoryItemResponse,
} from './update-product-inventory-item.dto';

export default async function (fastify: FastifyInstance) {
  const prisma: PrismaClient = fastify.prisma;

  fastify.get<{ Params: { productId: string } }>(
    '/',
    { onRequest: [fastify.authenticate] },
    async (
      req: FastifyRequest<{ Params: { productId: string } }>,
      res: FastifyReply
    ) => {
      const productId = ProductIdPathParamSchema.parse(req.params.productId);
      const validatedQueryString =
        ListProductInventoryItemQueryStringSchema.parse(req.query);
      const { filter, orderBy } = validatedQueryString;
      const page = validatedQueryString.page ?? 1;
      const pageSize: number =
        validatedQueryString.pageSize !== undefined
          ? Math.min(validatedQueryString.pageSize, PAGE_SIZE_MAX)
          : PAGE_SIZE_DEFAULT;
      const productInventoryItems = await prisma.productInventoryItem.findMany({
        where: { ...filter, productId },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: orderBy,
        include: {
          inventoryItem: {
            select: {
              id: true,
              code: true,
              name: true,
              specification: true,
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
          },
        },
      });

      const resBody: ListProductInventoryItemResponse = {
        items: productInventoryItems,
      };
      res.send(resBody);
    }
  );

  fastify.get<{ Params: { productId: string; inventoryItemId: string } }>(
    '/:inventoryItemId',
    { onRequest: [fastify.authenticate] },
    async (
      req: FastifyRequest<{
        Params: { productId: string; inventoryItemId: string };
      }>,
      res: FastifyReply
    ) => {
      const productId = ProductIdPathParamSchema.parse(req.params.productId);
      const inventoryItemId = InventoryItemIdPathParamSchema.parse(
        req.params.inventoryItemId
      );

      const productInventoryItem = await prisma.productInventoryItem.findUnique(
        {
          where: {
            productId_inventoryItemId: {
              productId: productId,
              inventoryItemId: inventoryItemId,
            },
          },
          include: {
            inventoryItem: {
              select: {
                id: true,
                code: true,
                name: true,
                specification: true,
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
            },
          },
        }
      );

      if (!productInventoryItem) {
        res.status(404).send({ message: 'ProductInventoryItem not found' });
        return;
      }

      const resBody: GetProductInventoryItemResponse = productInventoryItem;
      res.send(resBody);
    }
  );

  fastify.delete<{ Params: { productId: string; inventoryItemId: string } }>(
    '/:inventoryItemId',
    { onRequest: [fastify.authenticate] },
    async (
      req: FastifyRequest<{
        Params: { productId: string; inventoryItemId: string };
      }>,
      res: FastifyReply
    ) => {
      const productId = ProductIdPathParamSchema.parse(req.params.productId);
      const inventoryItemId = InventoryItemIdPathParamSchema.parse(
        req.params.inventoryItemId
      );

      try {
        await prisma.productInventoryItem.delete({
          where: {
            productId_inventoryItemId: {
              productId: productId,
              inventoryItemId: inventoryItemId,
            },
          },
        });
        const resBody: DeleteProductInventoryItemResponse = undefined;
        res.status(204).send(resBody);
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          // {
          //   name: 'PrismaClientKnownRequestError',
          //   code: 'P2025',
          //   clientVersion: '5.19.1',
          //   meta: {
          //     modelName: 'ProductInventoryItem',
          //     cause: 'Record to delete does not exist.',
          //   },
          // };
          const knownRequestError: PrismaClientKnownRequestError = error;
          if (knownRequestError.code === 'P2025') {
            res.status(404).send({ message: 'ProductInventoryItem not found' });
            return;
          }
        }

        throw error;
      }
    }
  );

  fastify.post<{
    Params: { productId: string };
    Body: CreateProductInventoryItemRequest;
  }>(
    '/',
    { onRequest: [fastify.authenticate] },
    async (
      req: FastifyRequest<{
        Params: { productId: string };
        Body: CreateProductInventoryItemRequest;
      }>,
      res: FastifyReply
    ) => {
      const productId = ProductIdPathParamSchema.parse(req.params.productId);
      const validatedBody = CreateProductInventoryItemRequestSchema.parse({
        ...req.body,
      });

      type ProductInventoryItemCreateBody = Prisma.Args<
        typeof prisma.productInventoryItem,
        'create'
      >['data'];

      const productInventoryItemCreateBody: ProductInventoryItemCreateBody = {
        ...validatedBody,
        productId,
        createdBy: req.user.userId,
        updatedBy: req.user.userId,
      };

      const productInventoryItem = await prisma.productInventoryItem.create({
        data: productInventoryItemCreateBody,
        include: {
          inventoryItem: {
            select: {
              id: true,
              code: true,
              name: true,
              specification: true,
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
          },
        },
      });

      const resBody: CreateProductInventoryItemResponse = productInventoryItem;
      res.status(201).send(resBody);
    }
  );

  fastify.patch<{ Params: { productId: string; inventoryItemId: string } }>(
    '/:inventoryItemId',
    { onRequest: [fastify.authenticate] },
    async (
      req: FastifyRequest<{
        Params: { productId: string; inventoryItemId: string };
      }>,
      res: FastifyReply
    ) => {
      const productId = ProductIdPathParamSchema.parse(req.params.productId);
      const inventoryItemId = InventoryItemIdPathParamSchema.parse(
        req.params.inventoryItemId
      );

      const validatedBody = UpdateProductInventoryItemRequestSchema.parse(
        req.body
      );
      try {
        const updatedProductInventoryItem =
          await prisma.productInventoryItem.update({
            where: {
              productId_inventoryItemId: {
                productId: productId,
                inventoryItemId: inventoryItemId,
              },
            },
            data: {
              ...validatedBody,
              updatedBy: req.user.userId,
            },
            include: {
              inventoryItem: {
                select: {
                  id: true,
                  code: true,
                  name: true,
                  specification: true,
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
              },
            },
          });

        const resBody: UpdateProductInventoryItemResponse =
          updatedProductInventoryItem;
        res.send(resBody);
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          const knownRequestError: PrismaClientKnownRequestError = error;
          if (knownRequestError.code === 'P2025') {
            res.status(404).send({ message: 'ProductInventoryItem not found' });
            return;
          }
        }
      }
    }
  );
}
